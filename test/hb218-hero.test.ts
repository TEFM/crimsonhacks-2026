import test from 'node:test';
import assert from 'node:assert/strict';
import { findBillBySlug, getPersonaImpact, personas } from '../src/models/billDetail.js';
import { calculateAnnualHouseholdImpact } from '../src/models/impactSimulator.js';

test('HB 218 has a prototype-labeled hero explanation and unverified legislative activity', () => {
  const bill = findBillBySlug('hb-218');
  assert.ok(bill?.detail);
  const detail = bill.detail;
  assert.match(detail.latestAction, /Prototype fixture:/);
  assert.match(detail.nextEvent, /Prototype fixture:/);
  assert.match(detail.plainSummary, /proposal/i);
  assert.equal(detail.currentVsProposed.length, 2);
  assert.match(detail.currentVsProposed[0][1], /not.*verified/i);
  assert.ok(detail.affectedGroups.length >= 3);
  assert.match(detail.effectiveDate ?? '', /unavailable/i);
  assert.ok(detail.votes.length);
  for (const vote of detail.votes) {
    assert.equal(vote.status, 'Unverified');
    assert.match(vote.result, /no official.*totals/i);
  }
  assert.doesNotMatch(bill.votes, /\d+[–-]\d+/);
});

test('HB 218 provides each existing persona a meaningful cautious impact explanation', () => {
  const bill = findBillBySlug('hb-218');
  assert.ok(bill);
  for (const persona of personas) {
    const impact = getPersonaImpact(bill, persona);
    assert.ok(impact.length > 65, persona);
    assert.doesNotMatch(impact, /personalized impact explanation is unavailable/i, persona);
  }
  assert.equal(new Set(personas.map((persona) => getPersonaImpact(bill, persona))).size, personas.length);
});

test('HB 218 separates missing official fiscal and historical data from hypothetical calculator inputs', () => {
  const bill = findBillBySlug('hb-218');
  assert.ok(bill?.detail);
  const detail = bill.detail;
  assert.equal(bill.officialSource, 'https://le.utah.gov/');
  assert.equal(detail.fiscal.stateCost, 'Not available');
  assert.equal(detail.fiscal.localCost, 'Not available');
  assert.match(detail.fiscal.note, /no verified fiscal note/i);
  assert.equal(detail.fiscal.sourceUrl, bill.officialSource);
  assert.ok(detail.impactSimulator);
  assert.equal(calculateAnnualHouseholdImpact(detail.impactSimulator.annualProgramCost, detail.impactSimulator.estimatedAffectedHouseholds), 30);
  assert.match(detail.impactSimulator.assumptions, /hypothetical/i);
  assert.match(detail.impactSimulator.assumptions, /not.*official fiscal/i);
  assert.match(detail.historical?.description ?? '', /no verified/i);
  assert.equal(detail.historical?.sourceUrl, bill.officialSource);
});
