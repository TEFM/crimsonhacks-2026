import test from 'node:test';
import assert from 'node:assert/strict';
import { createBillRepository, normalizeBill } from '../src/models/billRepository.js';
import { handler } from '../api/bills.js';
import { createUtahLegislatureClient, mapOfficialBill, toOfficialBillKey } from '../src/models/utahLegislatureClient.js';

const validBill = {
  id: 'HB 99',
  title: 'Example Bill',
  topic: 'Housing',
  sponsor: 'Rep. Example',
  officialSourceUrl: 'https://le.utah.gov/example'
};

test('normalizeBill rejects malformed records and unsafe source URLs', () => {
  assert.equal(normalizeBill({ id: 'not a bill', title: 'Bad', topic: 'Housing' }), null);
  const normalized = normalizeBill({ ...validBill, officialSourceUrl: 'javascript:alert(1)' });
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
  assert.equal(normalized.explanation.plainSummary, 'Demo explanation');
  assert.deepEqual(normalized.personas, { renter: 'Possible renter impact' });
  assert.equal(normalized.timeline[0].label, 'Introduced');
  assert.equal(normalized.simulator.annualProgramCost / normalized.simulator.affectedHouseholds, 25);
});

test('repository decodes direct-link bill IDs and does not expose invalid records', () => {
  const repository = createBillRepository([validBill, { id: 'HB nope', title: 'Bad', topic: 'Housing' }]);
  assert.equal(repository.list().length, 1);
  assert.equal(repository.findById('HB%2099').title, 'Example Bill');
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

test('official bill adapter maps named fields and formats Utah bill endpoint keys', () => {
  assert.equal(toOfficialBillKey('hb 218'), 'HB0218');
  assert.equal(toOfficialBillKey('not-a-bill'), null);
  const bill = mapOfficialBill({ BillNumber: 'HB0218', ShortTitle: 'Official sample', Sponsor: 'Rep. Ada', Url: 'https://le.utah.gov/bill' });
  assert.equal(bill.id, 'HB 218');
  assert.equal(bill.title, 'Official sample');
  assert.equal(bill.officialSourceUrl, 'https://le.utah.gov/bill');
});

test('official bill adapter caches the bill list for one hour', async () => {
  let requestCount = 0;
  let clock = 10;
  const client = createUtahLegislatureClient({
    token: 'server-only-token',
    now: () => clock,
    fetchImpl: async (url) => {
      requestCount += 1;
      assert.match(url, /\/bills\/2026GS\/billlist\/server-only-token$/);
      return { ok: true, json: async () => [{ BillNumber: 'SB0042', ShortTitle: 'Cached official sample' }] };
    }
  });

  assert.equal((await client.listBills())[0].id, 'SB 42');
  clock += 59 * 60 * 1000;
  await client.listBills();
  assert.equal(requestCount, 1);
  clock += 2 * 60 * 1000;
  await client.listBills();
  assert.equal(requestCount, 2);
});
