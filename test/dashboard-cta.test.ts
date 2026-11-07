import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dashboardFiltersReducer, initialDashboardFilters, filterBills } from '../src/models/dashboard.js';
import { toBillViewModels } from '../src/models/presentationAdapters.js';
import { findBillBySlug } from '../src/models/billDetail.js';

test('view all clears both active filters and reveals every fixture after an empty search', () => {
  const bills = toBillViewModels();
  const filtered = dashboardFiltersReducer(
    dashboardFiltersReducer(initialDashboardFilters, { type: 'set-topic', topic: 'Water' }),
    { type: 'set-query', query: 'no matching fixture' }
  );
  assert.equal(filterBills(bills, filtered.topic, filtered.query).length, 0);

  const reset = dashboardFiltersReducer(filtered, { type: 'reset' });
  assert.deepEqual(reset, { topic: 'All bills', query: '' });
  assert.deepEqual(filterBills(bills, reset.topic, reset.query), bills);
});

test('topic and search selection still work after view all resets the dashboard', () => {
  const reset = dashboardFiltersReducer({ topic: 'Water', query: 'unmatched' }, { type: 'reset' });
  const selected = dashboardFiltersReducer(reset, { type: 'set-topic', topic: 'Housing' });
  const searched = dashboardFiltersReducer(selected, { type: 'set-query', query: 'HB 218' });
  assert.deepEqual(filterBills(toBillViewModels(), searched.topic, searched.query).map((bill) => bill.id), ['HB 218']);
});

test('explore impact points to an existing fixture and a personal-impact section', async () => {
  const view = await readFile(new URL('../src/views/Dashboard.tsx', import.meta.url), 'utf8');
  const destination = view.match(/href="\/bills\/([^"#]+)#personal-impact"/);
  assert.ok(destination, 'Explore your impact must link to an existing local bill impact view');
  assert.ok(findBillBySlug(destination[1])?.detail?.personaImpacts);
  const billDetail = await readFile(new URL('../src/views/BillDetail.tsx', import.meta.url), 'utf8');
  assert.match(billDetail, /id="personal-impact"/);
});
