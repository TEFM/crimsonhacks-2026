export const topics = ['All bills', 'Housing', 'Water', 'Education', 'Transportation'];

export const bills = [
  {
    id: 'HB 218',
    title: 'Starter Home Availability Amendments',
    topic: 'Housing',
    sponsor: 'Rep. A. Morales',
    status: 'In committee',
    statusTone: 'amber',
    summary: 'Creates a faster approval path for qualifying starter-home developments near transit and existing utilities.',
    hearing: 'Land Use Committee · Tue, 9:00 AM',
    updated: 'Updated 38 min ago',
    votes: '6–3 committee vote',
    initials: 'HM'
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
    initials: 'ME'
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
    initials: 'JK'
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
    initials: 'CP'
  }
];

export const meetings = [
  { time: '9:00', meridiem: 'AM', committee: 'Land Use Committee', item: 'HB 218 · Starter Home Availability', room: 'Room 445', active: true },
  { time: '11:30', meridiem: 'AM', committee: 'Natural Resources Committee', item: 'SB 142 · Waterwise Communities', room: 'Room 210' },
  { time: '2:00', meridiem: 'PM', committee: 'Education Committee', item: 'HB 301 · Innovation Grants', room: 'Room 30' }
];
