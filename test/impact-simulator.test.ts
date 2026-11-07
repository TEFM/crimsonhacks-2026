import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ImpactSimulator } from '../src/components/ImpactSimulator.js';
import { findBillBySlug } from '../src/models/billDetail.js';
import { calculateAnnualHouseholdImpact, getSimulatorSource, parseHouseholdCount } from '../src/models/impactSimulator.js';
import type { Bill, ImpactSimulatorData } from '../src/models/types.js';

function renderSimulator(simulator?: ImpactSimulatorData): string {
  const bill = findBillBySlug('sb-142');
  assert.ok(bill?.detail);
  const scenarioBill: Bill = { ...bill, detail: { ...bill.detail, impactSimulator: simulator } };
  return renderToStaticMarkup(createElement(ImpactSimulator, { bill: scenarioBill }));
}

const scenario: ImpactSimulatorData = {
  annualProgramCost: 1200000,
  estimatedAffectedHouseholds: 50000,
  assumptions: 'Hypothetical inputs; equal allocation across households only.',
  fiscalNoteSourceUrl: 'https://le.utah.gov/'
};

test('an overflowing household estimate is unavailable rather than Infinity', () => {
  assert.equal(calculateAnnualHouseholdImpact(Number.MAX_VALUE, Number.MIN_VALUE), null);
});

test('a changed household input recalculates the estimate using a fixed annual cost', () => {
  assert.equal(calculateAnnualHouseholdImpact(scenario.annualProgramCost, parseHouseholdCount('50000') ?? undefined), 24);
  assert.equal(calculateAnnualHouseholdImpact(scenario.annualProgramCost, parseHouseholdCount('25000') ?? undefined), 48);
  assert.equal(parseHouseholdCount(' 100 '), 100);
  for (const input of ['', ' ', '0', '-2', '1.5', 'NaN', 'Infinity', '1e3', '0x10', '9007199254740992']) {
    assert.equal(parseHouseholdCount(input), null, `Expected invalid count: ${input}`);
  }
});

test('the simulator renders an accessible editable count, reset, inputs, formula, assumptions and disclaimer', () => {
  const html = renderSimulator(scenario);
  assert.match(html, /type="number"/);
  assert.match(html, /value="50000"/);
  assert.match(html, /for="simulator-households"/);
  assert.match(html, /aria-describedby="simulator-input-help"/);
  assert.match(html, /Reset scenario/);
  assert.match(html, /Annual program cost \(fixed\)/);
  assert.match(html, /\$1,200,000 ÷ 50,000 households = \$24/);
  assert.match(html, /role="status"/);
  assert.match(html, /Hypothetical inputs/);
  assert.match(html, /not official fiscal figures/);
  assert.match(html, /not a prediction or financial advice/);
  assert.match(html, /href="https:\/\/le.utah.gov\/"/);
});

test('missing and invalid fixture inputs render a safe unavailable state with disclosure and source', () => {
  for (const simulator of [undefined, { ...scenario, annualProgramCost: -1 }, { ...scenario, annualProgramCost: NaN },
    { ...scenario, estimatedAffectedHouseholds: Infinity }, { ...scenario, estimatedAffectedHouseholds: 0 },
    { ...scenario, estimatedAffectedHouseholds: 1.5 }]) {
    const html = renderSimulator(simulator);
    assert.match(html, /An estimate is unavailable/);
    assert.doesNotMatch(html, /type="number"/);
    assert.doesNotMatch(html, /\$NaN|\$∞|\$Infinity/);
    assert.match(html, /Assumptions &amp; uncertainty/);
    assert.match(html, /not a prediction or financial advice/);
    assert.match(html, /Review official sources for fiscal notes/);
  }
  assert.match(renderSimulator(), /No estimate assumptions are available/);
  assert.match(renderSimulator({ ...scenario, assumptions: '  ' }), /No estimate assumptions are available/);
});

test('zero cost remains a valid illustrative estimate and unsafe source URLs are discarded', () => {
  assert.equal(calculateAnnualHouseholdImpact(0, 20), 0);
  assert.match(renderSimulator({ ...scenario, annualProgramCost: 0 }), /\$0/);
  assert.equal(getSimulatorSource('javascript:alert(1)', 'http://example.com', 'https://le.utah.gov/'), 'https://le.utah.gov/');
  assert.equal(getSimulatorSource(null, undefined, '', 'javascript:alert(1)'), null);
  assert.doesNotMatch(renderSimulator({ ...scenario, fiscalNoteSourceUrl: 'javascript:alert(1)' }), /javascript:/);
});
