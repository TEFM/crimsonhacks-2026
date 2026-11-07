export const topics = ['All bills', 'Housing', 'Water', 'Education', 'Transportation'];

export const bills = [
  {
    id: 'HB 218',
    slug: 'hb-218',
    title: 'Starter Home Availability Amendments',
    topic: 'Housing',
    sponsor: 'Rep. A. Morales',
    status: 'In committee',
    statusTone: 'amber',
    summary: 'Creates a faster approval path for qualifying starter-home developments near transit and existing utilities.',
    hearing: 'Land Use Committee · Tue, 9:00 AM',
    updated: 'Updated 38 min ago',
    votes: '6–3 committee vote',
    initials: 'HM',
    officialSource: 'https://le.utah.gov/',
    detail: {
      latestAction: 'Referred to the House Land Use Committee for consideration.',
      nextEvent: 'House Land Use Committee · Tuesday, 9:00 AM · Room 445',
      sourceLabel: 'Official Utah Legislature bill record',
      plainSummary: 'This fixture describes a proposal to create a quicker local review path for certain starter-home developments near transit and existing utilities. The proposal may change how qualifying projects move through local approval; the exact effect depends on the final bill text and local implementation.',
      currentVsProposed: [
        ['Current process', 'Local governments generally use their existing development-review process for housing proposals.'],
        ['Proposed change', 'Qualifying starter-home projects could receive an accelerated review path under the proposal.']
      ],
      affectedGroups: ['Renters and first-time buyers', 'Local governments', 'Qualifying homebuilders'],
      votes: [
        { stage: 'House Land Use Committee', result: '6–3', date: 'Feb. 6, 2026', status: 'Passed' },
        { stage: 'House floor', result: 'Not yet scheduled', date: 'Pending', status: 'Upcoming' }
      ],
      fiscal: {
        stateCost: 'Not available in this demo fixture',
        localCost: 'Not available in this demo fixture',
        note: 'No fiscal note is included with this prototype fixture.',
        sourceUrl: 'https://le.utah.gov/'
      },
      impactSimulator: {
        annualProgramCost: 1200000,
        estimatedAffectedHouseholds: 50000,
        assumptions: 'Demo-only inputs divide a hypothetical annual program cost evenly across an estimated number of affected households. They do not reflect a fiscal note, tax rate, eligibility rules, or how costs would actually be funded.',
        fiscalNoteSourceUrl: 'https://le.utah.gov/'
      },
      personaImpacts: {
        Renter: 'If additional qualifying homes are approved and built, renters may eventually have more nearby housing options. The timing, number, and affordability of homes are uncertain.',
        Homeowner: 'Homeowners near qualifying projects may see changes in nearby development activity. The fixture does not establish property-value effects.',
        Parent: 'A faster review path could affect where new homes are built near schools and transit, but this fixture does not predict school or transportation impacts.',
        'Small-business owner': 'Construction and local growth may affect customer activity, though any business impact depends on project location and implementation.',
        'Driver / commuter': 'Projects near transit may change travel choices over time. This is an illustrative possibility, not a transportation forecast.',
        Taxpayer: 'The available demo fixture has no fiscal note, so it cannot estimate taxpayer costs or savings.'
      },
      historical: {
        title: 'Related prior-bill comparison',
        description: 'No verified historical comparison is included in this initial fixture. Add one only after linking to an official record and clearly describing the observed result.',
        sourceUrl: 'https://le.utah.gov/'
      }
    }
  },
  {
    id: 'SB 142',
    title: 'Waterwise Communities Act',
    topic: 'Water',
    sponsor: 'Sen. M. Ellis',
    status: 'On floor calendar',
    statusTone: 'blue',
    summary: 'Expands rebates for water-efficient landscaping and requires annual water-use reporting for large new developments.',
    hearing: 'Senate floor · Today, 1:00 PM',
    updated: 'Updated 1 hr ago',
    votes: 'Unanimous committee vote',
    initials: 'ME',
    officialSource: 'https://le.utah.gov/'
  },
  {
    id: 'HB 301',
    title: 'Classroom Innovation Grant Program',
    topic: 'Education',
    sponsor: 'Rep. J. Kim',
    status: 'New',
    statusTone: 'green',
    summary: 'Funds competitive grants for teacher-designed projects that improve hands-on learning and career readiness.',
    hearing: 'Education Committee · Wed, 8:00 AM',
    updated: 'Updated 2 hrs ago',
    votes: 'Awaiting committee vote',
    initials: 'JK',
    officialSource: 'https://le.utah.gov/'
  },
  {
    id: 'SB 87',
    title: 'Safe Routes and Transit Access',
    topic: 'Transportation',
    sponsor: 'Sen. C. Patel',
    status: 'Passed Senate',
    statusTone: 'crimson',
    summary: 'Creates a matching program for safer crossings, bike connections, and first-mile transit access.',
    hearing: 'House Transportation · Thu, 4:00 PM',
    updated: 'Updated yesterday',
    votes: '22–7 Senate vote',
    initials: 'CP',
    officialSource: 'https://le.utah.gov/'
  }
];

export const meetings = [
  {
    id: 'house-land-use-feb-10-2026', slug: 'house-land-use-feb-10-2026', date: 'Monday, February 10, 2026', time: '9:00 AM',
    committee: 'House Land Use Committee', body: 'House committee', room: 'Room 445', timing: 'today',
    scheduledBills: [{ id: 'HB 218', title: 'Starter Home Availability Amendments', billSlug: 'hb-218' }],
    agendaSourceUrl: 'https://le.utah.gov/', sourceLabel: 'Official Utah Legislature source (fixture link)'
  },
  {
    id: 'natural-resources-feb-10-2026', slug: 'natural-resources-feb-10-2026', date: 'Monday, February 10, 2026', time: '11:30 AM',
    committee: 'Natural Resources Committee', body: 'House committee', room: 'Room 210', timing: 'next',
    scheduledBills: [{ id: 'SB 142', title: 'Waterwise Communities Act' }],
    agendaSourceUrl: 'https://le.utah.gov/', sourceLabel: 'Official Utah Legislature source (fixture link)'
  },
  {
    id: 'education-feb-10-2026', slug: 'education-feb-10-2026', date: 'Monday, February 10, 2026', time: '2:00 PM',
    committee: 'Education Committee', body: 'House committee', room: 'Room 30', timing: 'upcoming',
    scheduledBills: [{ id: 'HB 301', title: 'Classroom Innovation Grant Program' }],
    agendaSourceUrl: 'https://le.utah.gov/', sourceLabel: 'Official Utah Legislature source (fixture link)'
  }
];
