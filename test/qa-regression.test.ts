import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { createElement, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { bills } from '../src/models/bills.js';
import { toBillViewModel, toBillViewModels, toMeetingViewModels } from '../src/models/presentationAdapters.js';
import { findBillBySlug, getPersonaImpact, personas } from '../src/models/billDetail.js';
import type { BillSeed } from '../src/models/types.js';
import { useImpactSimulator } from '../src/controllers/useImpactSimulator.js';
import { useDashboard } from '../src/controllers/useDashboard.js';
import { useBillDetail } from '../src/controllers/useBillDetail.js';

// Vite turns the flag import into an asset URL; supply the same contract for Node rendering.
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.svg')) return { format: 'module', source: `export default ${JSON.stringify(new URL(url).pathname)};`, shortCircuit: true };
    return nextLoad(url, context);
  }
});

const { Dashboard } = await import('../src/views/Dashboard.js');
const { BillDetail } = await import('../src/views/BillDetail.js');
const { MeetingDetail } = await import('../src/views/MeetingDetail.js');
const { MeetingAgenda } = await import('../src/components/MeetingAgenda.js');

function renderBill(slug: string): string {
  return renderToStaticMarkup(createElement(BillDetail, { slug }));
}

function withTemporaryBill(seed: BillSeed, action: () => void): void {
  const fixtureRecords = bills as BillSeed[];
  fixtureRecords.push(seed);
  try { action(); } finally { fixtureRecords.pop(); }
}

test('dashboard renders the complete fixture list, working CTA destinations, schedule and prototype disclosure', () => {
  const html = renderToStaticMarkup(createElement(Dashboard));
  assert.equal((html.match(/class="bill-card"/g) ?? []).length, bills.length);
  for (const bill of toBillViewModels()) assert.ok(html.includes(`href="/bills/${bill.slug}"`));
  assert.match(html, /aria-controls="bill-list"/);
  assert.match(html, /href="\/bills\/hb-218#personal-impact"/);
  assert.match(html, /PROTOTYPE SCHEDULE/);
  assert.match(html, /3 bills/);
  assert.match(html, /civic-information prototype/);
});

test('every direct fixture bill renders with sources and disclosures; unknown bills render recovery', () => {
  for (const bill of toBillViewModels()) {
    const html = renderBill(bill.slug ?? '');
    assert.ok(html.includes(bill.title));
    assert.match(html, /href="https:\/\/le.utah.gov\/"/);
    assert.match(html, /AI-ASSISTED EXPLANATION/);
    assert.match(html, /not legal or financial advice/);
    assert.match(html, /Activity below is an unverified prototype preview/);
    assert.match(html, /Timeline entries and any vote totals are unverified prototype data/);
    assert.match(html, /When could it begin\?/);
  }
  const unknown = renderBill('not-a-bill');
  assert.match(unknown, /BILL NOT FOUND/);
  assert.match(unknown, /href="\/"/);
  assert.doesNotMatch(unknown, /Household impact simulator/);
});

test('every meeting route renders agenda links and provenance; unknown agenda renders recovery', () => {
  for (const meeting of toMeetingViewModels()) {
    const html = renderToStaticMarkup(createElement(MeetingDetail, { slug: meeting.slug ?? '' }));
    assert.ok(html.includes(meeting.committee ?? ''));
    assert.match(html, /Meeting details and scheduled items are prototype fixtures/);
    assert.match(html, /href="https:\/\/le.utah.gov\/"/);
    for (const bill of meeting.scheduledBills ?? []) assert.ok(html.includes(`href="/bills/${bill.billSlug}"`));
  }
  const unknown = renderToStaticMarkup(createElement(MeetingDetail, { slug: 'not-an-agenda' }));
  assert.match(unknown, /MEETING NOT FOUND/);
  assert.match(unknown, /href="\/#meetings"/);
});

test('persona controls announce the selected view and all hero personas resolve distinct cautious explanations', () => {
  for (const slug of ['hb-218', 'sb-142', 'hb-301']) {
    const html = renderBill(slug);
    assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
    assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, personas.length - 1);
    assert.match(html, /class="impact-answer" aria-live="polite" aria-atomic="true"/);
    assert.match(html, /Viewing as a Renter/);
    const bill = findBillBySlug(slug);
    const impacts = personas.map((persona) => getPersonaImpact(bill, persona));
    assert.equal(new Set(impacts).size, personas.length);
    assert.ok(impacts.every((impact) => impact.length > 20));
  }
});

test('missing optional bill data renders fiscal, translation, timing, persona and simulator fallbacks safely', () => {
  withTemporaryBill({ id: 'HB 999', slug: 'hb-999', title: 'Missing optional data', topic: 'Housing' }, () => {
    const html = renderBill('hb-999');
    assert.match(html, /Status unavailable/);
    assert.match(html, /Latest action is unavailable/);
    assert.match(html, /No upcoming meeting is available/);
    assert.match(html, /plain-language explanation is not available/);
    assert.match(html, /Effective date unavailable/);
    assert.match(html, /personalized impact explanation is not available/);
    assert.match(html, /No vote data is available/);
    assert.match(html, /Not available/);
    assert.match(html, /An estimate is unavailable/);
    assert.match(html, /No verified historical comparison is available/);
    assert.match(html, /not a prediction or financial advice/);
    assert.match(html, /href="https:\/\/le.utah.gov\/"/);
  });
});

test('malformed optional fixture data is sanitized before reaching bill-detail presentation', () => {
  const seed = {
    id: 'HB 998', slug: 'hb-998', title: 'Malformed optional data', topic: 'Housing',
    timeline: {}, personas: { Renter: { unsafe: 'not text' } },
    explanation: { plainSummary: {}, effectiveDate: 2026, currentVsProposed: [] },
    fiscalNote: { stateCost: {}, localCost: [], sourceUrl: 'javascript:alert(1)' },
    detail: { plainSummary: {}, currentVsProposed: [null, ['Only one']], affectedGroups: [null, {}], votes: [null, { stage: 'Incomplete' }], fiscal: { stateCost: {}, sourceUrl: 'javascript:alert(2)' }, personaImpacts: { Renter: {} }, historical: { description: {}, sourceUrl: 'javascript:alert(3)' } }
  } as unknown as BillSeed;
  assert.doesNotThrow(() => toBillViewModel(seed));
  withTemporaryBill(seed, () => {
    const html = renderBill('hb-998');
    assert.match(html, /Malformed optional data/);
    assert.match(html, /not legal or financial advice/);
    assert.doesNotMatch(html, /javascript:|\[object Object\]|NaN|Infinity/);
  });
});

test('unsafe fixture source URLs never survive the presentation adapter', () => {
  const bill = toBillViewModel({
    id: 'HB 997', title: 'Unsafe sources', topic: 'Housing',
    officialSourceUrl: 'javascript:alert(1)', officialTextUrl: 'http://example.test/untrusted',
    fiscalNote: { stateCost: 'Not available', localCost: 'Not available', sourceUrl: 'data:text/html,bad' },
    historicalEffect: { title: 'Unavailable', detail: 'No verified outcome.', sourceUrl: 'javascript:alert(2)' }
  });
  assert.match(bill.officialSource, /^https:\/\//);
  assert.match(bill.detail?.fiscal.sourceUrl ?? '', /^https:\/\//);
  assert.match(bill.detail?.historical?.sourceUrl ?? '', /^https:\/\//);
});

test('simulator controller recalculates, suppresses invalid inputs, and resets actual React state', () => {
  const simulator = findBillBySlug('hb-218')?.detail?.impactSimulator;
  assert.ok(simulator);
  for (const editedInput of ['2000', '', '0', '-1', '2.5', 'Infinity']) {
    for (const shouldReset of [false, true]) {
      const snapshots: Array<{ input: string; estimate: number | null }> = [];
      function Harness() {
        const controller = useImpactSimulator(simulator);
        const [step, setStep] = useState(0);
        // React's server renderer supports render-phase state updates, allowing
        // controller transitions to be checked without a DOM/browser dependency.
        if (step === 0) { controller.setHouseholdInput(editedInput); setStep(1); }
        else if (step === 1 && shouldReset) { controller.resetHouseholds(); setStep(2); }
        snapshots.push({ input: controller.householdInput, estimate: controller.annualImpact });
        return null;
      }
      renderToStaticMarkup(createElement(Harness));
      const final = snapshots.at(-1);
      assert.ok(final);
      assert.equal(final.input, shouldReset ? '4000' : editedInput);
      assert.equal(final.estimate, shouldReset ? 30 : editedInput === '2000' ? 60 : null);
    }
  }
});

test('dashboard controller clears both filters after a real React-state empty search', () => {
  const snapshots: Array<{ topic: string; query: string; count: number }> = [];
  function Harness() {
    const dashboard = useDashboard();
    const [step, setStep] = useState(0);
    if (step === 0) { dashboard.setTopic('Water'); dashboard.setQuery('unmatched search'); setStep(1); }
    else if (step === 1) { dashboard.resetFilters(); setStep(2); }
    snapshots.push({ topic: dashboard.topic, query: dashboard.query, count: dashboard.filteredBills.length });
    return null;
  }
  renderToStaticMarkup(createElement(Harness));
  assert.ok(snapshots.some((snapshot) => snapshot.topic === 'Water' && snapshot.count === 0));
  assert.deepEqual(snapshots.at(-1), { topic: 'All bills', query: '', count: bills.length });
});

test('persona controller updates the selected explanation for every available persona', () => {
  for (const persona of personas) {
    const snapshots: Array<{ persona: string; impact: string }> = [];
    function Harness() {
      const detail = useBillDetail('hb-218');
      const [selected, setSelected] = useState(false);
      if (!selected) { detail.setPersona(persona); setSelected(true); }
      snapshots.push({ persona: detail.persona, impact: detail.personaImpact });
      return null;
    }
    renderToStaticMarkup(createElement(Harness));
    assert.deepEqual(snapshots.at(-1), { persona, impact: getPersonaImpact(findBillBySlug('hb-218'), persona) });
  }
});

test('malformed meeting fixture fields render unavailable fallbacks instead of objects or a false today label', () => {
  const meetings = toMeetingViewModels([{
    committee: 'Malformed meeting', time: {}, meridiem: {}, room: {}, item: {}, active: 'false'
  } as unknown as import('../src/models/bills.js').Meeting]);
  const html = renderToStaticMarkup(createElement(MeetingAgenda, { meetings }));
  assert.match(html, /Time TBD/);
  assert.match(html, /Location TBD/);
  assert.match(html, /Agenda items unavailable/);
  assert.doesNotMatch(html, /\[object Object\]|meeting-group-today/);
});
