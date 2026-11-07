import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile } from 'node:fs/promises';
import { toBillViewModel } from '../src/models/presentationAdapters.js';
import { EffectiveDate } from '../src/components/EffectiveDate.js';
import type { BillSeed, FixtureExplanation } from '../src/models/types.js';

const seed: BillSeed = { id: 'HB 999', title: 'Test fixture', topic: 'Housing' };
const explanation: FixtureExplanation = {
  plainSummary: 'Prototype explanation.',
  currentVsProposed: 'Unverified comparison.',
  affectedGroups: 'Potential applicants.',
  effectiveDate: '  Timing depends on final text and passage.  ',
  uncertainties: 'Verify official records.'
};

test('bill view model retains effective-date information from a structured explanation', () => {
  const bill = toBillViewModel({ ...seed, explanation });
  assert.equal(bill.detail?.effectiveDate, 'Timing depends on final text and passage.');
});

test('missing, unstructured, blank, and invalid effective dates remain unavailable', () => {
  for (const value of [undefined, 'Prototype summary only.', { ...explanation, effectiveDate: '  ' }, { ...explanation, effectiveDate: 42 }]) {
    const bill = toBillViewModel({ ...seed, explanation: value as BillSeed['explanation'] });
    assert.equal(bill.detail?.effectiveDate, undefined);
  }
});

test('effective date displays fixture timing safely and clearly labels it as unverified', () => {
  const markup = renderToStaticMarkup(createElement(EffectiveDate, { value: '<script>untrusted date</script>' }));
  assert.match(markup, /&lt;script&gt;untrusted date&lt;\/script&gt;/);
  assert.doesNotMatch(markup, /<script>/);
  assert.match(markup, /EFFECTIVE DATE · DEMO EXPLANATION/);
  assert.match(markup, /fixture-derived and has not been verified/);
});

test('unavailable effective date renders a clear fallback', () => {
  const markup = renderToStaticMarkup(createElement(EffectiveDate, {}));
  assert.match(markup, /When could it begin\?/);
  assert.match(markup, /Effective date unavailable in this fixture/);
});

test('bill detail includes effective date in the translator, official verification, and persona anchor', async () => {
  const source = await readFile(new URL('../src/views/BillDetail.tsx', import.meta.url), 'utf8');
  const translator = source.slice(source.indexOf('function Translator('), source.indexOf('function PersonalImpact('));
  assert.match(translator, /<EffectiveDate value=\{detail\?\.effectiveDate\}/);
  assert.match(translator, /Verify explanation and timing against official text/);
  assert.match(translator, /not legal or financial advice/);
  assert.match(source, /id="personal-impact"/);
  assert.match(source, /Activity below is an unverified prototype preview/);
  assert.match(source, /Timeline entries and any vote totals are unverified prototype data/);
  assert.match(source, /Review official sources for fiscal notes/);
});
