import assert from 'node:assert/strict';
import test from 'node:test';
import { summarizeBill } from '../src/models/billSummarizer.js';
import { personas } from '../src/models/billDetail.js';
import { toBillViewModels } from '../src/models/presentationAdapters.js';
import type { Bill } from '../src/models/types.js';

const bill: Bill = {
  id: 'HB 101', title: 'Sample bill', topic: 'Housing', sponsor: 'Rep. Test', status: 'In committee', statusTone: 'amber',
  summary: 'Creates a pilot program for qualifying homes.', hearing: 'Not scheduled', updated: 'Today', votes: 'No votes', initials: 'RT', officialSource: 'https://le.utah.gov/', dataOrigin: 'official-snapshot',
  detail: { latestAction: 'Referred', nextEvent: 'None', sourceLabel: 'Official record', plainSummary: 'The bill would create a pilot program.', currentVsProposed: [], affectedGroups: ['Qualifying homeowners'], votes: [], fiscal: { stateCost: 'Unavailable', localCost: 'Unavailable', note: 'Unavailable', sourceUrl: 'https://le.utah.gov/' }, personaImpacts: {} }
};

test('summarizeBill uses displayed facts and includes a verification limitation', () => {
  const summary = summarizeBill(bill, 'Renter');
  assert.equal(summary?.overview, 'The bill would create a pilot program.');
  assert.equal(summary?.demographic, 'Renter');
  assert.match(summary?.demographicImpact ?? '', /not available/i);
  assert.deepEqual(summary?.keyPoints, ['Current status: In committee.', 'May affect: Qualifying homeowners.']);
  assert.match(summary?.limitations ?? '', /official Utah Legislature record/i);
});

test('summarizeBill returns null when no usable summary is present', () => {
  assert.equal(summarizeBill({ ...bill, summary: 'Unavailable', detail: undefined }, 'Renter'), null);
});

test('summarizeBill keeps the selected demographic scenario with the bill', () => {
  const summary = summarizeBill({ ...bill, detail: { ...bill.detail!, personaImpacts: { Parent: 'Demo scenario: a parent may see a new program option.' } } }, 'Parent');
  assert.equal(summary?.demographicImpact, 'Demo scenario: a parent may see a new program option.');
});

test('every available demographic translation preserves the corresponding fixture scenario exactly', () => {
  for (const fixtureBill of toBillViewModels()) {
    for (const demographic of personas) {
      const summary = summarizeBill(fixtureBill, demographic);
      assert.ok(summary, `${fixtureBill.id} should have a summary`);
      assert.equal(summary.demographic, demographic);
      assert.equal(
        summary.demographicImpact,
        fixtureBill.detail?.personaImpacts[demographic]
          ?? 'A demographic-specific explanation is not available for this bill record. Review the official bill record for details.',
        `${fixtureBill.id} ${demographic}`
      );
      assert.equal(summary.overview, fixtureBill.detail?.plainSummary ?? fixtureBill.summary);
      assert.ok(summary.keyPoints.includes(`Current status: ${fixtureBill.status}.`));
    }
  }
});

test('summarizeBill uses the unavailable-demographic fallback without borrowing another group\'s scenario', () => {
  const summary = summarizeBill({ ...bill, detail: { ...bill.detail!, personaImpacts: { Parent: 'Parent-only scenario.' } } }, 'Taxpayer');
  assert.match(summary?.demographicImpact ?? '', /demographic-specific explanation is not available/i);
  assert.doesNotMatch(summary?.demographicImpact ?? '', /Parent-only scenario/);
});
