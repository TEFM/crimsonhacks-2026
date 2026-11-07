import test from 'node:test';
import assert from 'node:assert/strict';
import { findBillBySlug, getPersonaImpact } from '../src/models/billDetail.js';
import { calculateAnnualHouseholdImpact, formatCurrency } from '../src/models/impactSimulator.js';
import { toBillViewModels } from '../src/models/presentationAdapters.js';

test('findBillBySlug resolves the HB 218 detail fixture', () => {
  const bill = findBillBySlug('hb-218');
  assert.equal(bill?.id, 'HB 218');
  assert.match(bill?.detail?.plainSummary ?? '', /proposal/i);
});

test('hero fixture routes resolve with complete safe detail data', () => {
  for (const slug of ['sb-142', 'hb-301']) {
    const bill = findBillBySlug(slug);
    assert.ok(bill, `Expected ${slug} fixture`);
    assert.ok(bill.detail?.plainSummary);
    assert.ok(bill.detail?.currentVsProposed.length);
    assert.ok(bill.detail?.fiscal.sourceUrl);
    assert.ok(bill.detail?.impactSimulator?.assumptions);
    assert.equal(Object.keys(bill.detail?.personaImpacts ?? {}).length, 6);
  }
});

test('remaining dashboard fixture slugs resolve and unknown routes safely miss', () => {
  assert.equal(findBillBySlug('sb-87')?.id, 'SB 87');
  for (const bill of toBillViewModels()) {
    assert.ok(bill.slug, `Expected a safe route slug for ${bill.id}`);
    assert.equal(findBillBySlug(bill.slug)?.id, bill.id);
  }
  assert.equal(findBillBySlug('not-a-bill'), null);
});

test('bill detail provides a safe fallback for an unavailable persona explanation', () => {
  assert.match(getPersonaImpact(null, 'Renter'), /not available/i);
});

test('impact simulator divides fixture costs across affected households', () => {
  const annualImpact = calculateAnnualHouseholdImpact(1200000, 50000);
  assert.equal(annualImpact, 24);
  if (annualImpact === null) throw new Error('Expected valid simulator inputs to produce an estimate.');
  assert.equal(formatCurrency(annualImpact), '$24');
  assert.equal(calculateAnnualHouseholdImpact(1200000, 0), null);
});
