import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchBills } from '../src/models/billsApi.js';

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
  await assert.rejects(fetchBills({
    endpoint: 'https://api.example.test',
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ data: [], meta: {} }) })
  }), /did not identify its data source/);
  await assert.rejects(fetchBills({
    endpoint: 'https://api.example.test',
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ bills: [] }) })
  }), /unexpected response shape/);
});

test('fetchBills surfaces a server failure without treating it as official data', async () => {
  await assert.rejects(fetchBills({
    endpoint: 'https://api.example.test',
    fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) })
  }), /503/);
});
