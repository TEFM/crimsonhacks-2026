import test from 'node:test';
import assert from 'node:assert/strict';
import { findBillBySlug, getPersonaImpact } from '../src/models/billDetail.js';

test('findBillBySlug resolves the HB 218 detail fixture', () => {
  const bill = findBillBySlug('hb-218');
  assert.equal(bill?.id, 'HB 218');
  assert.match(bill?.detail?.plainSummary ?? '', /proposal/i);
});

test('bill detail provides a safe fallback for an unavailable persona explanation', () => {
  assert.match(getPersonaImpact(null, 'Renter'), /not available/i);
});
