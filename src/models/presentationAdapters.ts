import { bills, meetings, type Bill as BackendBill, type BillSeed, type Meeting as BackendMeeting } from './bills';
import type { Bill, ImpactSimulatorData, Meeting, Vote } from './types';

const OFFICIAL_UTAH_LEGISLATURE_URL = 'https://le.utah.gov/';

function slugifyBillId(id: string): string {
  return id.toLowerCase().replace(/\s+/g, '-');
}

function initialsFor(name: string | undefined): string {
  return (name ?? '')
    .replace(/^(Rep\.|Sen\.)\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '--';
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function sourceUrl(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value !== 'string') continue;
    try {
      const url = new URL(value);
      if (url.protocol === 'https:') return url.toString();
    } catch { /* Use the next existing source. */ }
  }
  return OFFICIAL_UTAH_LEGISLATURE_URL;
}

function personaImpacts(value: unknown): Record<string, string> {
  return Object.fromEntries(Object.entries(record(value)).flatMap(([name, impact]) => text(impact) ? [[name, text(impact)]] : []));
}

function timelineVotes(value: unknown, isDetail: boolean): Vote[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item: unknown) => {
    const event = record(item);
    const stage = text(isDetail ? event.stage : event.label);
    const result = text(isDetail ? event.result : event.detail);
    return stage && result ? [{ stage, result, date: text(event.date, 'Date unavailable'), status: text(isDetail ? event.status : undefined, 'Unverified') }] : [];
  });
}

function simulatorData(value: unknown, fiscalSource: string): ImpactSimulatorData | undefined {
  const simulator = record(value);
  const cost = simulator.annualProgramCost;
  const households = simulator.estimatedAffectedHouseholds ?? simulator.affectedHouseholds;
  if (typeof cost !== 'number' || !Number.isFinite(cost) || cost < 0
    || typeof households !== 'number' || !Number.isSafeInteger(households) || households <= 0) return undefined;
  return {
    annualProgramCost: cost, estimatedAffectedHouseholds: households,
    assumptions: text(simulator.assumptions, 'No estimate assumptions are available for this fixture.'),
    fiscalNoteSourceUrl: sourceUrl(simulator.fiscalNoteSourceUrl, fiscalSource)
  };
}

/** Validate optional fixture fields before supplying plain text and safe links to React. */
export function toBillViewModel(bill: BillSeed | BackendBill): Bill {
  const seed = record(bill);
  const detail = record(seed.detail);
  const explanation = record(seed.explanation);
  const summary = text(typeof seed.explanation === 'string' ? seed.explanation : explanation.plainSummary);
  const officialSource = sourceUrl(seed.officialSourceUrl, seed.officialTextUrl);
  const fiscal = { ...record(seed.fiscalNote), ...record(detail.fiscal) };
  const fiscalSource = sourceUrl(fiscal.sourceUrl, officialSource);
  const impacts = personaImpacts(detail.personaImpacts ?? seed.personas);
  const fixtureVotes = timelineVotes(seed.timeline, false);
  const historical = record(detail.historical ?? seed.historicalEffect);
  const comparison: (readonly [string, string])[] = Array.isArray(detail.currentVsProposed)
    ? detail.currentVsProposed.flatMap((pair: unknown) => Array.isArray(pair) && text(pair[0]) && text(pair[1]) ? [[text(pair[0]), text(pair[1])] as const] : [])
    : [['Current law', text(explanation.currentVsProposed, 'A current-law comparison is not available in this fixture.')], ['Proposed change', text(seed.summary, 'The proposed change is not available in this fixture.')]];
  const id = text(seed.id, 'Bill ID unavailable');
  const sponsor = text(seed.sponsor, 'Sponsor not available');
  return {
    id,
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text(seed.slug)) ? text(seed.slug) : /^(HB|SB) \d+$/.test(id) ? slugifyBillId(id) : undefined,
    title: text(seed.title, 'Bill title unavailable'),
    topic: text(seed.topic, 'Topic unavailable'),
    sponsor,
    status: text(seed.status, 'Status unavailable'),
    statusTone: seed.statusTone === 'amber' || seed.statusTone === 'green' || seed.statusTone === 'crimson' ? seed.statusTone : 'blue',
    summary: text(seed.summary, 'A plain-language summary is not available.'),
    hearing: text(seed.hearing, 'No upcoming meeting listed'),
    updated: text(seed.updated, 'Update time unavailable'),
    votes: text(seed.votes, 'Vote information unavailable'),
    initials: text(seed.initials, initialsFor(sponsor)),
    officialSource,
    detail: {
      latestAction: text(detail.latestAction, fixtureVotes[0]?.result ?? 'Latest action is unavailable in this cached fixture.'),
      nextEvent: text(detail.nextEvent, text(seed.hearing, 'No upcoming meeting is available.')),
      sourceLabel: text(detail.sourceLabel, text(seed.sourceStatus, 'Official Utah Legislature bill record')),
      plainSummary: text(detail.plainSummary, summary ? `This proposal: ${summary}` : 'A plain-language explanation is not available for this bill yet.'),
      effectiveDate: text(detail.effectiveDate, text(explanation.effectiveDate)) || undefined,
      currentVsProposed: comparison,
      affectedGroups: Array.isArray(detail.affectedGroups) ? detail.affectedGroups.flatMap((group: unknown) => text(group) ? [text(group)] : []) : Object.keys(impacts),
      votes: detail.votes !== undefined ? timelineVotes(detail.votes, true) : fixtureVotes,
      fiscal: {
        stateCost: text(fiscal.stateCost, 'Not available'),
        localCost: text(fiscal.localCost, 'Not available'),
        note: text(fiscal.note, 'Fiscal information is drawn from the cached demo fixture; verify the official fiscal note.'),
        sourceUrl: fiscalSource
      },
      impactSimulator: simulatorData(detail.impactSimulator ?? seed.simulator, fiscalSource),
      personaImpacts: impacts,
      historical: Object.keys(historical).length ? {
        title: text(historical.title, 'Historical context unavailable'),
        description: text(historical.description, text(historical.detail, 'No verified historical comparison is available.')),
        sourceUrl: sourceUrl(historical.sourceUrl, officialSource)
      } : undefined
    }
  };
}

export function toBillViewModels(records: readonly (BillSeed | BackendBill)[] = bills): Bill[] {
  return records.map(toBillViewModel);
}

/** Adds stable UI identifiers to backend meeting fixtures without changing their API shape. */
export function toMeetingViewModel(meeting: BackendMeeting, index: number): Meeting {
  const seed = record(meeting);
  const committee = text(seed.committee, 'Meeting details unavailable');
  const time = text(seed.time);
  const active = seed.active === true;
  const slug = index === 0
    ? 'house-land-use-feb-10-2026'
    : `${committee.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${index + 1}`;
  const item = text(seed.item);
  const [itemId, ...itemTitle] = item.split(' · ');
  return {
    id: slug,
    slug,
    date: 'Fixture schedule',
    time: time ? `${time} ${text(seed.meridiem)}`.trim() : undefined,
    committee: active ? `House ${committee}` : committee,
    body: 'Legislative committee',
    room: text(seed.room) || undefined,
    timing: active ? 'today' : 'upcoming',
    scheduledBills: itemId ? [{ id: itemId, title: itemTitle.join(' · ') || item, billSlug: /^(HB|SB) \d+$/.test(itemId) ? slugifyBillId(itemId) : undefined }] : [],
    agendaSourceUrl: OFFICIAL_UTAH_LEGISLATURE_URL,
    sourceLabel: 'Official Utah Legislature source (fixture link)'
  };
}

export function toMeetingViewModels(records: readonly BackendMeeting[] = meetings): Meeting[] {
  const viewMeetings = records.map(toMeetingViewModel);
  const nextIndex = viewMeetings.findIndex((meeting) => meeting.timing !== 'today');
  if (nextIndex >= 0) viewMeetings[nextIndex] = { ...viewMeetings[nextIndex], timing: 'next' };
  // This is the Senate-floor scenario already described by the SB 142 fixture,
  // not a newly retrieved or verified legislative calendar entry.
  if (records === meetings) viewMeetings.push({
    id: 'senate-floor-sb-142-fixture', slug: 'senate-floor-sb-142-fixture',
    date: 'Fixture schedule', time: '1:00 PM', committee: 'Senate floor', body: 'Floor calendar',
    timing: 'today', room: 'Location not verified',
    scheduledBills: [{ id: 'SB 142', title: 'Waterwise Communities Act', billSlug: 'sb-142' }],
    agendaSourceUrl: OFFICIAL_UTAH_LEGISLATURE_URL,
    sourceLabel: 'Official Utah Legislature source (prototype floor-calendar fixture)'
  });
  return viewMeetings;
}
