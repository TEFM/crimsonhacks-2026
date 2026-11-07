import { useMeetingDetail } from '../controllers/useMeetingDetail';
import { SiteHeader } from '../components/SiteHeader';
import { ArrowIcon } from '../components/ArrowIcon';

function SourceLink({ href, children }) {
  if (!href) return <p className="source-unavailable">An official agenda source is not available in this fixture.</p>;
  return <a className="source-link" href={href} target="_blank" rel="noreferrer">{children} <ArrowIcon /></a>;
}

function ScheduledBills({ bills }) {
  if (!Array.isArray(bills) || bills.length === 0) return <p className="agenda-empty">No scheduled bills are listed in this fixture.</p>;
  return <ul className="scheduled-bills">{bills.map((bill, index) => <li key={`${bill?.id ?? 'item'}-${index}`}>
    <span className="bill-id">{bill?.id ?? 'Bill ID unavailable'}</span>
    <div><strong>{bill?.title ?? 'Scheduled bill title unavailable'}</strong>{bill?.billSlug && <a href={`/bills/${bill.billSlug}`}>Open bill brief <ArrowIcon /></a>}</div>
  </li>)}</ul>;
}

export function MeetingDetail({ slug }) {
  const { meeting } = useMeetingDetail(slug);
  if (!meeting) return <><SiteHeader activePage="Meetings" /><main className="not-found"><a className="back-link" href="/#meetings">← Back to meetings</a><p className="eyebrow">MEETING NOT FOUND</p><h1>We couldn’t find that agenda.</h1><p>The meeting may not be available in the current fixture. Return to the dashboard to view listed meetings.</p></main></>;

  return <><SiteHeader activePage="Meetings" /><main className="detail-page agenda-detail-page"><header className="detail-header">
    <a className="back-link" href="/#meetings">← Back to meetings</a><p className="eyebrow">OFFICIAL MEETING INFORMATION</p>
    <h1>{meeting.committee ?? 'Meeting details unavailable'}</h1><p className="detail-sponsor">{meeting.body ?? 'Legislative meeting'} · {meeting.date ?? 'Date unavailable'} · {meeting.time ?? 'Time unavailable'}</p>
    <div className="detail-actions"><span className="fixture-badge">Fixture data</span><SourceLink href={meeting.agendaSourceUrl}>{meeting.sourceLabel ?? 'Open official agenda/source'}</SourceLink></div>
  </header><div className="agenda-layout"><section className="detail-card meeting-information"><p className="eyebrow">MEETING DETAILS</p><h2>When and where</h2>
    <dl><div><dt>Date</dt><dd>{meeting.date ?? 'Unavailable'}</dd></div><div><dt>Time</dt><dd>{meeting.time ?? 'Unavailable'}</dd></div><div><dt>Committee or body</dt><dd>{meeting.committee ?? meeting.body ?? 'Unavailable'}</dd></div><div><dt>Room / location</dt><dd>{meeting.room ?? 'Location unavailable'}</dd></div></dl>
  </section><section className="detail-card"><p className="eyebrow">SCHEDULED ITEMS</p><h2>Agenda bills</h2><ScheduledBills bills={meeting.scheduledBills} /><p className="disclaimer">Meeting details and scheduled items are prototype fixtures. Confirm dates, times, locations, and agenda contents with the official source before relying on them.</p><SourceLink href={meeting.agendaSourceUrl}>Open official agenda/source</SourceLink></section></div></main></>;
}
