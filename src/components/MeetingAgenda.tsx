import { getMeetingAgendaHref, getMeetingKind, getMeetingTiming, getPrimaryMeeting, meetingTimingLabels } from '../models/meetingDetail';
import { ArrowIcon } from './ArrowIcon';
import type { Meeting, MeetingTiming } from '../models/types';

const timingOrder: readonly MeetingTiming[] = ['today', 'next', 'upcoming'];

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const scheduledBill = meeting.scheduledBills?.[0];
  const timing = getMeetingTiming(meeting);
  return <a className={`meeting meeting-${timing}`} href={getMeetingAgendaHref(meeting)}>
    <div className="meeting-time"><strong>{meeting.time || 'Time TBD'}</strong></div>
    <div className="meeting-info"><span className="meeting-kind">{getMeetingKind(meeting)}</span><strong>{meeting.committee || meeting.body || 'Meeting details unavailable'}</strong><span>{scheduledBill ? `${scheduledBill.id || 'Bill ID unavailable'} · ${scheduledBill.title || 'Title unavailable'}` : 'Agenda items unavailable'}</span></div>
    <div className="meeting-end"><span className={`meeting-state ${timing}`}>{meetingTimingLabels[timing]}</span><span className="room">{meeting.room || 'Location TBD'}</span></div>
  </a>;
}

export function MeetingAgenda({ meetings }: { meetings?: readonly Meeting[] | null }) {
  const entries = Array.isArray(meetings) ? meetings.filter((meeting): meeting is Meeting => Boolean(meeting)) : [];
  const primaryMeeting = getPrimaryMeeting(entries);
  return <section className="agenda-card" aria-labelledby="agenda-title">
    <div className="section-heading compact"><div><p className="eyebrow">AT THE CAPITOL</p><h2 id="agenda-title">What’s happening next</h2></div><span className="calendar-button" aria-hidden="true">▦</span></div>
    <div className="date-line"><strong>Prototype schedule</strong><span>{entries.length} scheduled items</span></div>
    <p className="agenda-fixture-note">“Today” and “Next” refer to this demo fixture, not the live calendar. Verify all schedules with the official source.</p>
    {entries.length ? timingOrder.map((timing) => {
      const group = entries.filter((meeting) => getMeetingTiming(meeting) === timing);
      return group.length ? <section className={`meeting-group meeting-group-${timing}`} key={timing} aria-labelledby={`agenda-${timing}`}>
        <h3 id={`agenda-${timing}`}>{meetingTimingLabels[timing]}</h3>
        <ul className="meetings">{group.map((meeting) => <li key={meeting.id ?? meeting.slug}><MeetingCard meeting={meeting} /></li>)}</ul>
      </section> : null;
    }) : <p className="agenda-empty">No upcoming meetings or floor-calendar items are available in this fixture.</p>}
    {primaryMeeting && <a className="agenda-link" href={getMeetingAgendaHref(primaryMeeting)}>Open full agenda <ArrowIcon /></a>}
  </section>;
}
