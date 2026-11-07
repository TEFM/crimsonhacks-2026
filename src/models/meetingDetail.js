import { meetings } from './bills.js';

export const meetingTimingLabels = {
  today: 'Today',
  next: 'Next',
  upcoming: 'Upcoming'
};

export function findMeetingBySlug(slug) {
  return meetings.find((meeting) => meeting?.slug === slug) ?? null;
}

export function getPrimaryMeeting(meetingList = meetings) {
  const safeMeetingList = Array.isArray(meetingList) ? meetingList : [];
  return safeMeetingList.find((meeting) => meeting?.timing === 'today')
    ?? safeMeetingList.find((meeting) => meeting?.timing === 'next')
    ?? safeMeetingList[0]
    ?? null;
}

export function getMeetingAgendaHref(meeting) {
  return meeting?.slug ? `/meetings/${meeting.slug}` : meeting?.agendaSourceUrl ?? '/#meetings';
}
