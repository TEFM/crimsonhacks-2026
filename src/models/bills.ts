import type { BillSeed } from './types';

export type { BillSeed } from './types';
/** Validated API/fixture record used by the repository layer. Kept separate from the display model. */
export interface Bill {
  id: string; title: string; topic: string; sponsor: string; status: string; statusTone: string;
  summary: string; hearing: string; updated: string; votes: string; initials: string;
  officialSourceUrl: string | null; officialTextUrl: string | null; sourceStatus: string;
  explanation: { plainSummary: string; currentVsProposed: string; affectedGroups: string; effectiveDate: string; uncertainties: string } | null;
  personas: Record<string, string>; timeline: Array<{ label: string; detail: string; date: string }>;
  historicalEffect: { title: string; detail: string; sourceUrl: string | null } | null;
  simulator: { annualProgramCost: number; affectedHouseholds: number; assumptions: string } | null;
  uncertainty: string | null; fiscalNote: { stateCost: string; localCost: string; sourceUrl: string | null } | null;
}
export const topics = ['All bills', 'Housing', 'Water', 'Education', 'Transportation', 'Public safety'] as const;

const officialSourceUrl = 'https://le.utah.gov/';
const fixtureSource = 'Prototype/demo fixture - verify details on the Utah Legislature record';
const unavailableFiscalNote = { stateCost: 'Not available', localCost: 'Not available', sourceUrl: null };
const personas = {
  Renter: 'A personalized impact explanation is unavailable in this prototype fixture. Review the official bill record.',
  Homeowner: 'A personalized impact explanation is unavailable in this prototype fixture. Review the official bill record.',
  Parent: 'A personalized impact explanation is unavailable in this prototype fixture. Review the official bill record.',
  'Small-business owner': 'A personalized impact explanation is unavailable in this prototype fixture. Review the official bill record.',
  'Driver / commuter': 'A personalized impact explanation is unavailable in this prototype fixture. Review the official bill record.',
  Taxpayer: 'A personalized impact explanation is unavailable in this prototype fixture. Review the official bill record.'
};

export const bills: readonly BillSeed[] = [
  {
    id: 'HB 218', slug: 'hb-218', title: 'Starter Home Availability Amendments', topic: 'Housing', sponsor: 'Rep. A. Morales', status: 'In committee', statusTone: 'amber', summary: 'Prototype proposal: a faster approval path for qualifying starter-home developments near transit and existing utilities.', hearing: 'Land Use Committee - Tue, 9:00 AM', updated: 'Cached prototype fixture', votes: 'Committee action listed in prototype fixture', initials: 'HM', officialSourceUrl, sourceStatus: fixtureSource,
    explanation: {
      plainSummary: 'This proposal explores a faster approval path for qualifying starter-home developments near transit and existing utilities. Eligibility and local planning requirements must be checked against official text. This prototype does not establish that more homes will be built or that prices will fall.',
      currentVsProposed: 'Current-law approval procedures are not verified in this prototype. The proposed faster approval path and its eligibility conditions require official bill text for confirmation.',
      affectedGroups: 'Potential homebuyers and renters, nearby homeowners, local planning staff, builders, and taxpayers.',
      effectiveDate: 'Effective date unavailable in this fixture. Passage, amendments, and final official text would determine when any change could begin.',
      uncertainties: 'Prototype explanation only, not legal or financial advice. Housing supply, prices, participation, infrastructure costs, and implementation timing are uncertain.'
    },
    fiscalNote: unavailableFiscalNote,
    personas: {
      Renter: 'Additional starter homes could expand housing options if eligible projects are approved and built. This prototype cannot estimate rents, affordability, or when homes might become available.',
      Homeowner: 'Nearby development and local approval processes could change if the final text applies to your area. Property-value effects and neighborhood changes are uncertain.',
      Parent: 'Families considering a starter home may have more options if projects proceed. School enrollment, school funding, and family housing savings are not established by this prototype.',
      'Small-business owner': 'Builders and nearby businesses could encounter different planning processes or local demand if projects proceed. Eligibility, compliance costs, and business benefits remain unverified.',
      'Driver / commuter': 'The fixture focuses on homes near transit and existing utilities, which could change some households\' travel options. It does not establish service availability, traffic effects, or commuting savings.',
      Taxpayer: 'Local planning or infrastructure work could have costs, but no verified fiscal note is included. The hypothetical simulator amount is not an appropriation, tax increase, or forecast of your household cost.'
    },
    timeline: [{ label: 'Committee action', detail: 'Prototype fixture: committee activity is listed; no official vote totals are included. Verify the official roll call.', date: 'Demo timeline' }],
    simulator: { annualProgramCost: 120000, affectedHouseholds: 4000, assumptions: 'Illustrative scenario inputs only: a hypothetical annual program cost of $120,000 divided among 4,000 hypothetical households. These are not an official fiscal estimate, an appropriation, a tax bill, or a prediction of housing prices or household effects.' },
    historicalEffect: { title: 'Historical context unavailable', detail: 'No verified prior-bill comparison or observed housing outcome is included in this prototype. Similar policy goals alone do not establish comparable results.', sourceUrl: null },
    detail: {
      latestAction: 'Prototype fixture: committee activity is listed; no official vote totals or verified action date are included. Check the official legislative record.',
      nextEvent: 'Prototype fixture: Land Use Committee listing, Tuesday at 9:00 AM. This is a demo schedule; confirm the actual date, time, and agenda with official sources.',
      plainSummary: 'This proposal explores a faster approval path for qualifying starter-home developments near transit and existing utilities. Eligibility and local planning requirements must be checked against official text. This prototype does not establish that more homes will be built or that prices will fall.',
      currentVsProposed: [
        ['Current law', 'Existing local approval procedures, zoning conditions, and review deadlines are not verified in this prototype fixture.'],
        ['Proposed change', 'The fixture describes a possible faster approval path for qualifying starter-home developments near transit and existing utilities. Official text is needed to confirm eligibility, local obligations, exceptions, and implementation timing.']
      ],
      affectedGroups: ['Potential starter-home buyers and renters', 'Nearby homeowners and residents', 'Local planning staff and builders', 'Taxpayers if public resources are required'],
      votes: [{ stage: 'Committee action', result: 'Prototype fixture only; no official vote totals or verified result are included. Confirm the official roll call.', date: 'Demo timeline', status: 'Unverified' }],
      fiscal: { stateCost: 'Not available', localCost: 'Not available', note: 'No verified fiscal note is included in this prototype. Do not infer public costs, savings, or household charges from the hypothetical simulator.', sourceUrl: officialSourceUrl },
      historical: { title: 'Historical context unavailable', description: 'No verified prior-bill comparison or observed housing outcome is included in this prototype. Similar policy goals alone do not establish comparable results; any comparison would require official bill records, implementation details, and outcome evidence.', sourceUrl: officialSourceUrl }
    }
  },
  {
    id: 'SB 142', slug: 'sb-142', title: 'Waterwise Communities Act', topic: 'Water', sponsor: 'Sen. M. Ellis', status: 'On floor calendar', statusTone: 'blue', summary: 'Expands rebates for water-efficient landscaping and requires annual water-use reporting for large new developments.', hearing: 'Senate floor - Today, 1:00 PM', updated: 'Updated 1 hr ago', votes: 'Committee action listed in prototype fixture', initials: 'ME', officialSourceUrl, sourceStatus: fixtureSource,
    explanation: 'This prototype fixture describes possible rebates for water-efficient landscaping and water-use reporting for certain new developments. Official text controls definitions, funding limits, and effective dates.', fiscalNote: unavailableFiscalNote,
    personas: { ...personas, Renter: 'A property owner may choose water-efficient improvements, but this fixture does not establish tenant savings.', Homeowner: 'A rebate may be available only if final legislation creates one and eligibility requirements are met.', Parent: 'No direct school impact is established by this prototype.', 'Small-business owner': 'Reporting could apply depending on final definitions; the prototype does not identify covered businesses.', 'Driver / commuter': 'No direct commuting impact is established.', Taxpayer: 'Program cost is unavailable because no verified fiscal note is included.' },
    timeline: [{ label: 'Committee action', detail: 'Prototype fixture indicates committee action; official vote record has not been verified.', date: 'Demo timeline' }, { label: 'Floor calendar', detail: 'Listed as a prototype floor item; confirm the schedule on the official record.', date: 'Demo timeline' }], historicalEffect: { title: 'Prior-bill context unavailable', detail: 'This prototype does not contain a verified historical comparison or outcome.', sourceUrl: null },
    detail: { latestAction: 'Prototype fixture: listed for Senate floor consideration; verify the official record.', nextEvent: 'Prototype fixture: Senate floor item. Schedule may change.', plainSummary: 'The proposal would explore water-wise landscaping incentives and reporting for some large new developments. This is a plain-language prototype summary, not a legal interpretation.', currentVsProposed: [['Current law', 'Current-law requirements are not verified in this prototype fixture.'], ['Proposed change', 'The fixture describes potential rebates and annual reporting, but official bill text is needed for who qualifies and what is required.']], affectedGroups: ['Homeowners considering landscaping changes', 'Large new developments, if covered by final text', 'Local water providers and taxpayers'], votes: [{ stage: 'Committee action', result: 'No official totals included in this prototype fixture.', date: 'Demo timeline', status: 'Unverified' }], fiscal: { stateCost: 'Not available', localCost: 'Not available', note: 'No verified fiscal note is included in this prototype. Costs and savings should not be inferred.', sourceUrl: officialSourceUrl }, impactSimulator: { annualProgramCost: 240000, estimatedAffectedHouseholds: 8000, assumptions: 'Illustrative scenario inputs only: divides a hypothetical program total across a hypothetical participant count. These are not an official fiscal estimate or household prediction.', fiscalNoteSourceUrl: officialSourceUrl }, historical: { title: 'Historical context unavailable', description: 'No verified prior-bill comparison or outcome is included in this prototype fixture.', sourceUrl: officialSourceUrl } }
  },
  {
    id: 'HB 301', slug: 'hb-301', title: 'Classroom Innovation Grant Program', topic: 'Education', sponsor: 'Rep. J. Kim', status: 'New', statusTone: 'green', summary: 'Funds competitive grants for teacher-designed projects that improve hands-on learning and career readiness.', hearing: 'Education Committee - Wed, 8:00 AM', updated: 'Updated 2 hrs ago', votes: 'Awaiting committee vote', initials: 'JK', officialSourceUrl, sourceStatus: fixtureSource,
    explanation: 'This prototype fixture describes competitive grants for teacher-designed learning projects. Eligibility, funding, administration, and results remain unverified until official text and fiscal material are available.', fiscalNote: unavailableFiscalNote,
    personas: { ...personas, Renter: 'No direct housing or rental effect is established by this education-grant prototype.', Homeowner: 'No property or homeowner effect is established by this prototype.', Parent: 'A school may be able to seek a grant if final eligibility rules allow it; participation and benefits are uncertain.', 'Small-business owner': 'Career-readiness projects could create local partnerships, but this prototype does not guarantee opportunities.', 'Driver / commuter': 'No direct transportation effect is established.', Taxpayer: 'No verified fiscal note or program appropriation is included in this prototype.' }, timeline: [{ label: 'Introduced', detail: 'New bill in cached prototype data; official filing details are not verified.', date: 'Demo timeline' }], historicalEffect: { title: 'Prior-bill context unavailable', detail: 'No verified comparison is available in this prototype.', sourceUrl: null },
    detail: { latestAction: 'Prototype fixture: newly introduced; verify the official legislative record.', nextEvent: 'Prototype fixture: Education Committee listing. Schedule may change.', plainSummary: 'The proposal would create a competitive grant concept for teacher-designed hands-on and career-readiness projects. It does not establish a guaranteed grant, funding amount, or outcome.', currentVsProposed: [['Current law', 'Existing grant programs and eligibility have not been verified in this prototype fixture.'], ['Proposed change', 'The fixture describes a possible competitive grant program; official text is needed to confirm recipients, selection criteria, administration, and effective date.']], affectedGroups: ['Teachers and school staff who may apply', 'Students at participating schools', 'School administrators and possible community partners', 'Taxpayers if funding is appropriated'], votes: [], fiscal: { stateCost: 'Not available', localCost: 'Not available', note: 'A verified fiscal note is not included in this prototype. No fiscal amount should be inferred.', sourceUrl: officialSourceUrl }, impactSimulator: { annualProgramCost: 150000, estimatedAffectedHouseholds: 5000, assumptions: 'Illustrative scenario inputs only: divides a hypothetical program total across a hypothetical beneficiary count. These are not an official fiscal estimate or household prediction.', fiscalNoteSourceUrl: officialSourceUrl }, historical: { title: 'Historical context unavailable', description: 'No verified historical comparison or program outcome is included in this prototype fixture.', sourceUrl: officialSourceUrl } }
  },
  {
    id: 'SB 87', slug: 'sb-87', title: 'Safe Routes and Transit Access', topic: 'Transportation', sponsor: 'Sen. C. Patel', status: 'Passed Senate', statusTone: 'crimson', summary: 'Creates a matching program for safer crossings, bike connections, and first-mile transit access.', hearing: 'House Transportation - Thu, 4:00 PM', updated: 'Updated yesterday', votes: 'Senate action listed in prototype fixture', initials: 'CP', officialSourceUrl, sourceStatus: fixtureSource,
    explanation: 'This prototype fixture describes a matching program for crossing, bicycle, and transit-access projects. Official text is required to determine the program scope, funding requirements, and project selection.', fiscalNote: unavailableFiscalNote,
    personas: { ...personas, Renter: 'Access improvements may benefit a neighborhood if funded, but no project is guaranteed.', Homeowner: 'Local projects may affect travel routes, but location-specific effects are unknown.', Parent: 'Safer crossings could affect school trips only where projects are selected.', 'Small-business owner': 'Construction and accessibility changes may affect nearby businesses.', 'Driver / commuter': 'Travel conditions could change near funded projects; no travel-time estimate is available.', Taxpayer: 'The fiscal note is not available.' }, timeline: [{ label: 'Senate action', detail: 'Prototype fixture reports Senate passage; verify the official roll call and status.', date: 'Demo timeline' }], historicalEffect: { title: 'Related prior bill', detail: 'No verified comparison is available.', sourceUrl: null }
  },
  { id: 'HB 164', title: 'Neighborhood Safety Grant Amendments', topic: 'Public safety', sponsor: 'Rep. R. Chen', status: 'New', statusTone: 'green', summary: 'A proposed local safety-grant update included as a cached prototype record.', hearing: 'Law Enforcement Committee - Fri, 10:00 AM', updated: 'Cached prototype fixture', votes: 'Awaiting committee vote', initials: 'RC', officialSourceUrl, sourceStatus: fixtureSource, explanation: 'This proposed measure is represented only by prototype data. Read official bill text before relying on it.', fiscalNote: unavailableFiscalNote },
  { id: 'SB 203', title: 'Water Infrastructure Planning', topic: 'Water', sponsor: 'Sen. D. Larsen', status: 'New', statusTone: 'green', summary: 'A proposed water-planning update included as a cached prototype record.', hearing: 'Natural Resources Committee - Next week', updated: 'Cached prototype fixture', votes: 'Awaiting committee vote', initials: 'DL', officialSourceUrl, sourceStatus: fixtureSource, explanation: 'This proposed measure is represented only by prototype data. Read official bill text before relying on it.', fiscalNote: unavailableFiscalNote }
];

export interface Meeting { time: string; meridiem: string; committee: string; item: string; room: string; active?: boolean; }
export const meetings: readonly Meeting[] = [
  { time: '9:00', meridiem: 'AM', committee: 'Land Use Committee', item: 'HB 218 - Starter Home Availability', room: 'Room 445', active: true },
  { time: '11:30', meridiem: 'AM', committee: 'Natural Resources Committee', item: 'SB 142 - Waterwise Communities', room: 'Room 210' },
  { time: '2:00', meridiem: 'PM', committee: 'Education Committee', item: 'HB 301 - Innovation Grants', room: 'Room 30' }
];
