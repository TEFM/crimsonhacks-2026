import test from 'node:test';
import assert from 'node:assert/strict';
import { billIdFromSlug, findBillBySlug, getPersonaImpact } from '../src/models/billDetail.js';
import { calculateAnnualHouseholdImpact, formatCurrency } from '../src/models/impactSimulator.js';

test('findBillBySlug resolves the HB 218 detail fixture', () => {
  const bill = findBillBySlug('hb-218');
  assert.equal(bill?.id, 'HB 218');
  assert.match(bill?.detail?.plainSummary ?? '', /proposal/i);
});

test('bill detail provides a safe fallback for an unavailable persona explanation', () => {
  assert.match(getPersonaImpact(null, 'Renter'), /not available/i);
});

test('bill-detail URLs map only valid bill slugs to API bill IDs', () => {
  assert.equal(billIdFromSlug('hb-0218'), 'HB 218');
  assert.equal(billIdFromSlug('not-a-bill'), null);
});

test('impact simulator divides fixture costs across affected households', () => {
  const annualImpact = calculateAnnualHouseholdImpact(1200000, 50000);
  assert.equal(annualImpact, 24);
  if (annualImpact === null) throw new Error('Expected valid simulator inputs to produce an estimate.');
  assert.equal(formatCurrency(annualImpact), '$24');
  assert.equal(calculateAnnualHouseholdImpact(1200000, 0), null);
});
