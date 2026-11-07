import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchBill, fetchBills } from '../src/models/billsApi.js';

const officialPayload = {
  data: [{
    id: 'HB 218',
    title: 'Official bill',
    topic: 'Legislation',
    sponsor: 'Rep. Example',
    sourceStatus: 'Official Utah Legislature API'
  }],
  meta: { source: 'official-utah-legislature-api' }
};

test('fetchBills validates and normalizes a labeled official API response', async () => {
  const result = await fetchBills({
    endpoint: 'https://api.example.test/',
    fetchImpl: async (url) => {
      assert.equal(url, 'https://api.example.test/api/bills');
      return { ok: true, status: 200, json: async () => officialPayload };
    }
  });

  assert.equal(result.source, 'official-utah-legislature-api');
  assert.equal(result.bills[0]?.id, 'HB 218');
  assert.equal(result.bills[0]?.status, 'Status unavailable');
});

test('fetchBills rejects unconfigured endpoints and unlabelled or malformed responses', async () => {
  await assert.rejects(fetchBills({ endpoint: undefined }), /not configured/);
  await assert.rejects(fetchBills({ endpoint: 'http://api.example.test' }), /not configured/);
  await assert.rejects(fetchBills({
    endpoint: 'https://api.example.test',
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ data: [], meta: {} }) })
  }), /did not identify its data source/);
  await assert.rejects(fetchBills({
    endpoint: 'https://api.example.test',
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ bills: [] }) })
  }), /unexpected response shape/);
});

test('fetchBills permits a local HTTP endpoint for development-only integration testing', async () => {
  const result = await fetchBills({
    endpoint: 'http://127.0.0.1:5443',
    fetchImpl: async (url) => {
      assert.equal(url, 'http://127.0.0.1:5443/api/bills');
      return { ok: true, status: 200, json: async () => officialPayload };
    }
  });
  assert.equal(result.bills[0]?.title, 'Official bill');
});

test('fetchBills surfaces a server failure without treating it as official data', async () => {
  await assert.rejects(fetchBills({
    endpoint: 'https://api.example.test',
    fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) })
  }), /503/);
});

test('fetchBill validates and normalizes a directly opened bill-detail response', async () => {
  const result = await fetchBill('HB 218', {
    endpoint: 'https://api.example.test/',
    fetchImpl: async (url) => {
      assert.equal(url, 'https://api.example.test/api/bills/HB%20218');
      return { ok: true, status: 200, json: async () => ({ data: officialPayload.data[0], meta: { source: 'official-utah-legislature-api' } }) };
    }
  });
  assert.equal(result.bill.id, 'HB 218');
  assert.equal(result.source, 'official-utah-legislature-api');
});
