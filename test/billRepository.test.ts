import test from 'node:test';
import assert from 'node:assert/strict';
import { createBillRepository, normalizeBill } from '../src/models/billRepository.js';
import { handler } from '../api/bills.js';
import { handler as deployedBillsHandler } from '../amplify/functions/bills-api/handler.js';
import { createUtahLegislatureClient, mapOfficialBill, toOfficialBillKey } from '../src/models/utahLegislatureClient.js';

const validBill = {
  id: 'HB 99',
  title: 'Example Bill',
  topic: 'Housing',
  sponsor: 'Rep. Example',
  officialSourceUrl: 'https://le.utah.gov/example'
};

const liveDeveloperToken = process.env.UTAH_LEGISLATURE_DEVELOPER_TOKEN?.trim();

test('normalizeBill rejects malformed records and unsafe source URLs', () => {
  assert.equal(normalizeBill({ id: 'not a bill', title: 'Bad', topic: 'Housing' }), null);
  const normalized = normalizeBill({ ...validBill, officialSourceUrl: 'javascript:alert(1)' });
  assert.ok(normalized);
  assert.equal(normalized.officialSourceUrl, null);
  assert.equal(normalized.status, 'Status unavailable');
});

test('normalizeBill preserves structured translator, persona, timeline, and estimate data', () => {
  const normalized = normalizeBill({
    ...validBill,
    explanation: 'Demo explanation',
    personas: { renter: 'Possible renter impact', ignored: 7 },
    timeline: [{ label: 'Introduced', detail: 'Demo action', date: 'Demo date' }],
    simulator: { annualProgramCost: 100, affectedHouseholds: 4, assumptions: 'Demo inputs.' }
  });
  assert.ok(normalized);
  assert.ok(normalized.explanation);
  assert.ok(normalized.simulator);
  assert.equal(normalized.explanation.plainSummary, 'Demo explanation');
  assert.deepEqual(normalized.personas, { renter: 'Possible renter impact' });
  assert.equal(normalized.timeline[0].label, 'Introduced');
  assert.equal(normalized.simulator.annualProgramCost / normalized.simulator.affectedHouseholds, 25);
});

test('normalizeBill supplies safe fallbacks and excludes malformed optional data', () => {
  const normalized = normalizeBill({
    id: 'sb 7',
    title: '  Safe defaults  ',
    topic: '  Water ',
    officialTextUrl: 'http://example.test/bill',
    timeline: [{ label: 'Valid event', detail: 'Has detail' }, { label: '', detail: 'Ignored' }, null],
    personas: { renter: '  Relevant impact  ', ignored: 3 },
    simulator: { annualProgramCost: 100, affectedHouseholds: 0 },
    explanation: { plainSummary: '  Explanation  ' }
  });

  assert.ok(normalized);
  assert.equal(normalized.id, 'SB 7');
  assert.equal(normalized.title, 'Safe defaults');
  assert.equal(normalized.officialTextUrl, null);
  assert.deepEqual(normalized.timeline, [{ label: 'Valid event', detail: 'Has detail', date: 'Date unavailable' }]);
  assert.deepEqual(normalized.personas, { renter: 'Relevant impact' });
  assert.equal(normalized.simulator, null);
  assert.equal(normalized.explanation?.plainSummary, 'Explanation');
  assert.match(normalized.explanation?.uncertainties ?? '', /Verify all details/);
});

test('repository decodes direct-link bill IDs and does not expose invalid records', () => {
  const repository = createBillRepository([validBill, { id: 'HB nope', title: 'Bad', topic: 'Housing' }]);
  const found = repository.findById('HB%2099');
  assert.ok(found);
  assert.equal(repository.list().length, 1);
  assert.equal(found.title, 'Example Bill');
  assert.equal(repository.findById('SB%201'), null);
  assert.equal(repository.findById('%not-a-url'), null);
});

test('bill API returns a record for a direct bill request and 404 for an unknown bill', async () => {
  const found = await handler({ pathParameters: { id: 'HB%20218' } });
  assert.equal(found.statusCode, 200);
  assert.equal(JSON.parse(found.body).data.id, 'HB 218');

  const missing = await handler({ pathParameters: { id: 'SB%20999' } });
  assert.equal(missing.statusCode, 404);

  const unsupported = await handler({ requestContext: { http: { method: 'POST' } } });
  assert.equal(unsupported.statusCode, 405);
});

test('bill API filters fixture records and supports raw-path bill URLs', async () => {
  const filtered = await handler({ queryStringParameters: { topic: 'Housing', query: 'starter' } });
  const filteredBody = JSON.parse(filtered.body);
  assert.equal(filtered.statusCode, 200);
  assert.equal(filtered.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(filteredBody.meta.source, 'cached-demo-fixture');
  assert.deepEqual(filteredBody.data.map((bill: { id: string }) => bill.id), ['HB 218']);

  const direct = await handler({ rawPath: '/api/bills/SB%20142' });
  assert.equal(direct.statusCode, 200);
  assert.equal(JSON.parse(direct.body).data.id, 'SB 142');
});

test('Amplify Lambda entry point exposes the validated bills handler', async () => {
  const response = await deployedBillsHandler({ pathParameters: { id: 'HB%20218' } });
  assert.equal(response.statusCode, 200);
  assert.equal(JSON.parse(response.body).data.id, 'HB 218');
});

test('official bill adapter maps named fields and formats Utah bill endpoint keys', () => {
  assert.equal(toOfficialBillKey('hb 218'), 'HB0218');
  assert.equal(toOfficialBillKey('not-a-bill'), null);
  const bill = mapOfficialBill({ BillNumber: 'HB0218', ShortTitle: 'Official sample', Sponsor: 'Rep. Ada', Url: 'https://le.utah.gov/bill' });
  assert.ok(bill);
  assert.equal(bill.id, 'HB 218');
  assert.equal(bill.title, 'Official sample');
  assert.equal(bill.officialSourceUrl, 'https://le.utah.gov/bill');
  assert.equal(mapOfficialBill({ BillNumber: 'HB0001' }), null);
});

test('official bill adapter caches the bill list for one hour', async () => {
  let requestCount = 0;
  let clock = 10;
  const client = createUtahLegislatureClient({
    token: 'server-only-token',
    now: () => clock,
    fetchImpl: async (url: string) => {
      requestCount += 1;
      assert.match(url, /\/bills\/2026GS\/billlist\/server-only-token$/);
      return { ok: true, status: 200, json: async () => [{ BillNumber: 'SB0042', ShortTitle: 'Cached official sample' }] };
    }
  });

  const listedBills = await client.listBills();
  assert.ok(listedBills[0]);
  assert.equal(listedBills[0].id, 'SB 42');
  clock += 59 * 60 * 1000;
  await client.listBills();
  assert.equal(requestCount, 1);
  clock += 2 * 60 * 1000;
  await client.listBills();
  assert.equal(requestCount, 2);
});

test('official client handles a single detail object and reports upstream failures', async () => {
  const requestedUrls: string[] = [];
  const client = createUtahLegislatureClient({
    token: 'token',
    fetchImpl: async (url: string) => {
      requestedUrls.push(url);
      return { ok: true, status: 200, json: async () => ({ BillNumber: 'HB0005', ShortTitle: 'Detail bill' }) };
    }
  });

  const bill = await client.getBill('HB 5');
  assert.equal(bill?.id, 'HB 5');
  assert.match(requestedUrls[0] ?? '', /\/HB0005\/token$/);
  assert.equal(await client.getBill('not a bill'), null);

  const failingClient = createUtahLegislatureClient({
    token: 'token',
    fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) })
  });
  await assert.rejects(failingClient.listBills(), /503/);
});

test('official client rejects an unexpected bill-list response shape', async () => {
  const client = createUtahLegislatureClient({
    token: 'token',
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ unexpected: [] }) })
  });

  await assert.rejects(client.listBills(), /unexpected bill-list shape/);
});

test('live Utah bill feed returns normalized official records', { skip: !liveDeveloperToken }, async () => {
  const client = createUtahLegislatureClient({ token: liveDeveloperToken });
  const bills = await client.listBills();

  assert.ok(bills.length > 0, 'The official bill list should contain at least one mappable bill.');
  for (const bill of bills) {
    assert.match(bill.id, /^(HB|SB) \d+$/, 'Bill IDs must be normalized for direct links.');
    assert.ok(bill.title.trim(), 'Official bills must include a title.');
    assert.equal(bill.sourceStatus, 'Official Utah Legislature API');
    assert.equal(bill.summary, 'Official bill data retrieved from the Utah Legislature API. Read the official bill text for legal details.');
  }
});
