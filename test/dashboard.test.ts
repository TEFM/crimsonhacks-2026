import test from 'node:test';
import assert from 'node:assert/strict';
import { filterBills } from '../src/models/dashboard.js';

const sampleBills = [
  { id: 'HB 1', title: 'Housing Access', sponsor: 'Rep. A', topic: 'Housing' },
  { id: 'SB 2', title: 'Water Planning', sponsor: 'Sen. B', topic: 'Water' }
];

test('filterBills filters by a selected topic', () => {
  assert.deepEqual(filterBills(sampleBills, 'Water', ''), [sampleBills[1]]);
});

test('filterBills searches bill fields without regard to case', () => {
  assert.deepEqual(filterBills(sampleBills, 'All bills', 'housing'), [sampleBills[0]]);
  assert.deepEqual(filterBills(sampleBills, 'All bills', 'sen. b'), [sampleBills[1]]);
});

test('filterBills returns no results when a query has no match', () => {
  assert.deepEqual(filterBills(sampleBills, 'All bills', 'education'), []);
});

test('filterBills treats a malformed query as an empty search', () => {
  assert.deepEqual(filterBills(sampleBills, 'All bills', null as unknown as string), sampleBills);
});
