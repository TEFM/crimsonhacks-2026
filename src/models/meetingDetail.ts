import { meetings } from './bills.js';
import type { Meeting, MeetingTiming } from './types';

export const meetingTimingLabels: Record<MeetingTiming, string> = {
  today: 'Today',
  next: 'Next',
  upcoming: 'Upcoming'
};

export function findMeetingBySlug(slug: string): Meeting | null {
  return meetings.find((meeting) => meeting?.slug === slug) ?? null;
}

export function getPrimaryMeeting(meetingList: readonly Partial<Meeting>[] | null = meetings): Partial<Meeting> | null {
  const safeMeetingList = Array.isArray(meetingList) ? meetingList : [];
  return safeMeetingList.find((meeting) => meeting?.timing === 'today')
    ?? safeMeetingList.find((meeting) => meeting?.timing === 'next')
    ?? safeMeetingList[0]
    ?? null;
}

export function getMeetingAgendaHref(meeting: Partial<Meeting> | null | undefined): string {
  return meeting?.slug ? `/meetings/${meeting.slug}` : meeting?.agendaSourceUrl ?? '/#meetings';
}
