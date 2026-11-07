import { bills, meetings, type BillSeed, type Meeting as BackendMeeting } from './bills';
import type { Bill, Meeting } from './types';

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

/** Converts validated backend fixture records into the optional data used by the UI. */
export function toBillViewModel(bill: BillSeed): Bill {
  const explanation = typeof bill.explanation === 'string' ? bill.explanation : bill.explanation?.plainSummary;
  return {
    id: bill.id,
    slug: slugifyBillId(bill.id),
    title: bill.title,
    topic: bill.topic,
    sponsor: bill.sponsor ?? 'Sponsor not available',
    status: bill.status ?? 'Status unavailable',
    statusTone: bill.statusTone === 'amber' || bill.statusTone === 'green' || bill.statusTone === 'crimson' ? bill.statusTone : 'blue',
    summary: bill.summary ?? 'A plain-language summary is not available.',
    hearing: bill.hearing ?? 'No upcoming meeting listed',
    updated: bill.updated ?? 'Update time unavailable',
    votes: bill.votes ?? 'Vote information unavailable',
    initials: bill.initials ?? initialsFor(bill.sponsor),
    officialSource: bill.officialSourceUrl ?? bill.officialTextUrl ?? OFFICIAL_UTAH_LEGISLATURE_URL,
    detail: {
      latestAction: bill.timeline?.[0]?.detail ?? 'Latest action is unavailable in this cached fixture.',
      nextEvent: bill.hearing ?? 'No upcoming meeting is available.',
      sourceLabel: bill.sourceStatus ?? 'Official Utah Legislature bill record',
      plainSummary: explanation ? `This proposal: ${explanation}` : 'A plain-language explanation is not available for this bill yet.',
      currentVsProposed: [[
        'Current law',
        bill.explanation && typeof bill.explanation === 'object' ? bill.explanation.currentVsProposed : 'A current-law comparison is not available in this fixture.'
      ], [
        'Proposed change',
        bill.summary ?? 'The proposed change is not available in this fixture.'
      ]],
      affectedGroups: Object.keys(bill.personas ?? {}),
      votes: (bill.timeline ?? []).map((event) => ({ stage: event.label, result: event.detail, date: event.date, status: 'Recorded' })),
      fiscal: {
        stateCost: bill.fiscalNote?.stateCost ?? 'Not available',
        localCost: bill.fiscalNote?.localCost ?? 'Not available',
        note: 'Fiscal information is drawn from the cached demo fixture; verify the official fiscal note.',
        sourceUrl: bill.fiscalNote?.sourceUrl ?? bill.officialSourceUrl ?? OFFICIAL_UTAH_LEGISLATURE_URL
      },
      impactSimulator: bill.simulator ? {
        annualProgramCost: bill.simulator.annualProgramCost,
        estimatedAffectedHouseholds: bill.simulator.affectedHouseholds,
        assumptions: bill.simulator.assumptions,
        fiscalNoteSourceUrl: bill.fiscalNote?.sourceUrl ?? bill.officialSourceUrl ?? OFFICIAL_UTAH_LEGISLATURE_URL
      } : undefined,
      personaImpacts: bill.personas ?? {},
      historical: bill.historicalEffect ? {
        title: bill.historicalEffect.title,
        description: bill.historicalEffect.detail,
        sourceUrl: bill.historicalEffect.sourceUrl ?? bill.officialSourceUrl ?? OFFICIAL_UTAH_LEGISLATURE_URL
      } : undefined
    }
  };
}

export function toBillViewModels(records: readonly BillSeed[] = bills): Bill[] {
  return records.map(toBillViewModel);
}

/** Adds stable UI identifiers to backend meeting fixtures without changing their API shape. */
export function toMeetingViewModel(meeting: BackendMeeting, index: number): Meeting {
  const slug = index === 0
    ? 'house-land-use-feb-10-2026'
    : `${meeting.committee.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${index + 1}`;
  const [itemId, ...itemTitle] = meeting.item.split(' · ');
  return {
    id: slug,
    slug,
    date: 'Fixture schedule',
    time: `${meeting.time} ${meeting.meridiem}`,
    committee: meeting.active ? `House ${meeting.committee}` : meeting.committee,
    body: 'Legislative committee',
    room: meeting.room,
    timing: meeting.active ? 'today' : 'upcoming',
    scheduledBills: [{ id: itemId, title: itemTitle.join(' · ') || meeting.item, billSlug: slugifyBillId(itemId) }],
    agendaSourceUrl: OFFICIAL_UTAH_LEGISLATURE_URL,
    sourceLabel: 'Official Utah Legislature source (fixture link)'
  };
}

export function toMeetingViewModels(records: readonly BackendMeeting[] = meetings): Meeting[] {
  return records.map(toMeetingViewModel);
}
