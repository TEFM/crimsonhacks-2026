export const topics = ['All bills', 'Housing', 'Water', 'Education', 'Transportation', 'Public safety'];

const fixtureSource = 'Cached demo fixture — official links pending verification';
const unavailableFiscalNote = { stateCost: 'Not available', localCost: 'Not available', sourceUrl: null };

export const bills = [
  {
    id: 'HB 218', title: 'Starter Home Availability Amendments', topic: 'Housing', sponsor: 'Rep. A. Morales',
    status: 'In committee', statusTone: 'amber',
    summary: 'Creates a faster approval path for qualifying starter-home developments near transit and existing utilities.',
    hearing: 'Land Use Committee · Tue, 9:00 AM', updated: 'Updated 38 min ago', votes: '6–3 committee vote', initials: 'HM',
    sourceStatus: fixtureSource,
    explanation: 'This demo record describes a possible faster approval path for qualifying starter-home developments. The actual legal effect depends on the enrolled bill text, amendments, and implementation rules.',
    fiscalNote: unavailableFiscalNote,
    personas: { renter: 'More housing supply could eventually affect rental options, but this fixture cannot estimate rents or timing.', homeowner: 'Nearby development and planning processes could change; property-value effects are uncertain.', parentStudent: 'No direct school-policy change is shown in this fixture.', smallBusiness: 'Builders may face a different approval process if they qualify.', driverCommuter: 'Projects near transit could affect travel patterns, but no effect is established.', taxpayer: 'No verified fiscal note is available.' },
    timeline: [{ label: 'Committee vote', detail: 'Cached demo data reports 6–3; verify the official roll call.', date: 'Demo timeline' }],
    simulator: { annualProgramCost: 120000, affectedHouseholds: 4000, assumptions: 'Illustrative demo inputs only; not a fiscal note or prediction.' },
    historicalEffect: { title: 'Related prior bill', detail: 'No verified related-bill outcome is included in this fixture.', sourceUrl: null }
  },
  {
    id: 'SB 142', title: 'Waterwise Communities Act', topic: 'Water', sponsor: 'Sen. M. Ellis',
    status: 'On floor calendar', statusTone: 'blue',
    summary: 'Expands rebates for water-efficient landscaping and requires annual water-use reporting for large new developments.',
    hearing: 'Senate floor · Today, 1:00 PM', updated: 'Updated 1 hr ago', votes: 'Unanimous committee vote', initials: 'ME',
    sourceStatus: fixtureSource,
    explanation: 'This demo record describes rebates for water-efficient landscaping and reporting requirements for some new developments. Consult the official text for definitions, funding limits, and effective dates.',
    fiscalNote: unavailableFiscalNote,
    personas: { renter: 'A landlord may choose water-efficient improvements, but no tenant savings are established.', homeowner: 'You may be eligible for a rebate only if the final bill creates one and you meet its rules.', parentStudent: 'No direct school impact is established.', smallBusiness: 'Requirements could apply depending on final definitions.', driverCommuter: 'No direct commuting impact is established.', taxpayer: 'Program cost is unknown without a verified fiscal note.' },
    timeline: [{ label: 'Committee vote', detail: 'Cached demo data says unanimous; verify official record.', date: 'Demo timeline' }, { label: 'Floor calendar', detail: 'Listed as a demo floor item.', date: 'Today (demo)' }], historicalEffect: { title: 'Related prior bill', detail: 'No verified comparison is available.', sourceUrl: null }
  },
  {
    id: 'HB 301', title: 'Classroom Innovation Grant Program', topic: 'Education', sponsor: 'Rep. J. Kim',
    status: 'New', statusTone: 'green',
    summary: 'Funds competitive grants for teacher-designed projects that improve hands-on learning and career readiness.',
    hearing: 'Education Committee · Wed, 8:00 AM', updated: 'Updated 2 hrs ago', votes: 'Awaiting committee vote', initials: 'JK',
    sourceStatus: fixtureSource,
    explanation: 'This demo record describes competitive grants for teacher-designed learning projects. Eligibility, funding, and administration are not established by this demonstration data.',
    fiscalNote: unavailableFiscalNote, personas: { parentStudent: 'A school could seek a grant, but participation and benefits are uncertain.', taxpayer: 'The fiscal note is not available.' }, timeline: [{ label: 'Introduced', detail: 'New bill in cached demo data.', date: 'Demo timeline' }], historicalEffect: { title: 'Related prior bill', detail: 'No verified comparison is available.', sourceUrl: null }
  },
  {
    id: 'SB 87', title: 'Safe Routes and Transit Access', topic: 'Transportation', sponsor: 'Sen. C. Patel',
    status: 'Passed Senate', statusTone: 'crimson',
    summary: 'Creates a matching program for safer crossings, bike connections, and first-mile transit access.',
    hearing: 'House Transportation · Thu, 4:00 PM', updated: 'Updated yesterday', votes: '22–7 Senate vote', initials: 'CP',
    sourceStatus: fixtureSource,
    explanation: 'This demo record describes a matching program for crossing, bicycle, and transit-access projects. The official bill text is needed to determine the program’s scope and funding requirements.',
    fiscalNote: unavailableFiscalNote, personas: { renter: 'Access improvements may benefit a neighborhood if funded, but no project is guaranteed.', homeowner: 'Local projects may affect travel routes, but location-specific effects are unknown.', parentStudent: 'Safer crossings could affect school trips only where projects are selected.', smallBusiness: 'Construction and accessibility changes may affect nearby businesses.', driverCommuter: 'Travel conditions could change near funded projects; no travel-time estimate is available.', taxpayer: 'The fiscal note is not available.' }, timeline: [{ label: 'Senate vote', detail: 'Cached demo data reports 22–7; verify official roll call.', date: 'Demo timeline' }], historicalEffect: { title: 'Related prior bill', detail: 'No verified comparison is available.', sourceUrl: null }
  },
  { id: 'HB 164', title: 'Neighborhood Safety Grant Amendments', topic: 'Public safety', sponsor: 'Rep. R. Chen', status: 'New', statusTone: 'green', summary: 'A proposed local safety-grant update included as a cached demonstration record.', hearing: 'Law Enforcement Committee · Fri, 10:00 AM', updated: 'Cached demo fixture', votes: 'Awaiting committee vote', initials: 'RC', sourceStatus: fixtureSource, explanation: 'This proposed measure is represented only by demo data. Read official bill text before relying on it.', fiscalNote: unavailableFiscalNote },
  { id: 'SB 203', title: 'Water Infrastructure Planning', topic: 'Water', sponsor: 'Sen. D. Larsen', status: 'New', statusTone: 'green', summary: 'A proposed water-planning update included as a cached demonstration record.', hearing: 'Natural Resources Committee · Next week', updated: 'Cached demo fixture', votes: 'Awaiting committee vote', initials: 'DL', sourceStatus: fixtureSource, explanation: 'This proposed measure is represented only by demo data. Read official bill text before relying on it.', fiscalNote: unavailableFiscalNote }
];

export const meetings = [
  { time: '9:00', meridiem: 'AM', committee: 'Land Use Committee', item: 'HB 218 · Starter Home Availability', room: 'Room 445', active: true },
  { time: '11:30', meridiem: 'AM', committee: 'Natural Resources Committee', item: 'SB 142 · Waterwise Communities', room: 'Room 210' },
  { time: '2:00', meridiem: 'PM', committee: 'Education Committee', item: 'HB 301 · Innovation Grants', room: 'Room 30' }
];
