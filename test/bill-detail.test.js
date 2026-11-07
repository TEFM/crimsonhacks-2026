import test from 'node:test';
import assert from 'node:assert/strict';
import { findBillBySlug, getPersonaImpact } from '../src/models/billDetail.js';
import { calculateAnnualHouseholdImpact, formatCurrency } from '../src/models/impactSimulator.js';

test('findBillBySlug resolves the HB 218 detail fixture', () => {
  const bill = findBillBySlug('hb-218');
  assert.equal(bill?.id, 'HB 218');
  assert.match(bill?.detail?.plainSummary ?? '', /proposal/i);
});

test('bill detail provides a safe fallback for an unavailable persona explanation', () => {
  assert.match(getPersonaImpact(null, 'Renter'), /not available/i);
});

test('impact simulator divides fixture costs across affected households', () => {
  assert.equal(calculateAnnualHouseholdImpact(1200000, 50000), 24);
  assert.equal(formatCurrency(calculateAnnualHouseholdImpact(1200000, 50000)), '$24');
  assert.equal(calculateAnnualHouseholdImpact(1200000, 0), null);
});
