import { useRef } from 'react';
import { toMeetingViewModels } from '../models/presentationAdapters';
import { useDashboard } from '../controllers/useDashboard';
import { SiteHeader } from '../components/SiteHeader';
import { ArrowIcon } from '../components/ArrowIcon';
import { MeetingAgenda } from '../components/MeetingAgenda';
import type { Bill } from '../models/types';

function SearchIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.2 4.2" /></svg>; }
function BillCard({ bill }: { bill: Bill }) { const detailHref = bill.slug ? `/bills/${bill.slug}` : null; return <article className="bill-card"><div className="bill-topline"><span className="bill-id">{bill.id}</span><span className={`status ${bill.statusTone}`}>{bill.status}</span></div><h3>{bill.title}</h3><p>{bill.summary}</p><div className="bill-footer"><div className="sponsor"><span className="avatar">{bill.initials}</span><span>{bill.sponsor}</span></div>{detailHref ? <a className="card-link" href={detailHref}>View brief <ArrowIcon /></a> : <span className="card-link">Brief unavailable</span>}</div><div className="bill-meta"><span>{bill.hearing}</span><span>{bill.votes}</span></div></article>; }

export function Dashboard() {
  const { topic, setTopic, query, setQuery, resetFilters, filteredBills, topics } = useDashboard();
  const watchTitleRef = useRef<HTMLHeadingElement>(null);
  const showAllBills = () => {
    resetFilters();
    watchTitleRef.current?.focus({ preventScroll: true });
    watchTitleRef.current?.scrollIntoView({ block: 'start' });
  };
  const meetings = toMeetingViewModels();
  const scheduledBillCount = new Set(meetings.flatMap((meeting) => meeting.scheduledBills?.flatMap((bill) => bill.id ? [bill.id] : []) ?? [])).size;
  return <><SiteHeader /><main><section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">UTAH LEGISLATURE - 2026 SESSION</p><h1>Utah bills,<br /><em>clearly explained.</em></h1><p className="lede">Follow what is moving at the Capitol and understand how it may affect the life you lead in Utah.</p><label className="search"><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bills, topics, or sponsors" aria-label="Search bills, topics, or sponsors" /></label></div><aside className="session-card" aria-label="Session update"><div className="session-rule"></div><p>PROTOTYPE SCHEDULE</p><strong>{scheduledBillCount} bills</strong><span>in the fixture committee and floor schedule</span><a href="#meetings">See today's agenda <ArrowIcon /></a><div className="mountains" aria-hidden="true"><span></span><span></span><span></span></div></aside></section><section className="content-grid"><section className="watch-section" aria-labelledby="watch-title"><div className="section-heading"><div><p className="eyebrow">FOLLOW THE ACTION</p><h2 id="watch-title" ref={watchTitleRef} tabIndex={-1}>Bills to watch</h2></div><button type="button" className="all-link" onClick={showAllBills} aria-controls="bill-list">View all bills <ArrowIcon /></button></div><div className="filters" aria-label="Bill topics">{topics.map((item) => <button key={item} className={topic === item ? 'selected' : ''} onClick={() => setTopic(item)} type="button">{item}</button>)}</div><div className="bill-list" id="bill-list">{filteredBills.length ? filteredBills.map((bill) => <BillCard key={bill.id} bill={bill} />) : <div className="empty"><strong>No bills found</strong><span>Try a different topic or search term.</span></div>}</div></section><aside className="right-rail" id="meetings"><MeetingAgenda meetings={meetings} /><section className="impact-card" id="about"><div className="impact-icon" aria-hidden="true"></div><p className="eyebrow">MAKE IT PERSONAL</p><h2>How could a bill affect you?</h2><p>Choose what matters to you and get a plain-language impact brief.</p><div className="persona-row"><span>Renter</span><span>Parent</span><span>Taxpayer</span></div><a className="impact-cta" href="/bills/hb-218#personal-impact">Explore your impact <ArrowIcon /></a></section></aside></section><footer><span>Beehive Brief is a civic-information prototype. Bill summaries are for demonstration only.</span><span>Built for Crimson Hacks 2026</span></footer></main></>;
}
