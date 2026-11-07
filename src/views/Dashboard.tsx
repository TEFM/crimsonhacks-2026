import { meetings } from '../models/bills';
import type { BillSeed, Meeting } from '../models/bills';
import { useDashboard } from '../controllers/useDashboard';

function Mark() {
  return <div className="mark" aria-hidden="true"><span></span><span></span><span></span></div>;
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.2 4.2" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></svg>;
}

function BillCard({ bill }: { bill: BillSeed }) {
  return (
    <article className="bill-card">
      <div className="bill-topline">
        <span className="bill-id">{bill.id}</span>
        <span className={`status ${bill.statusTone ?? 'blue'}`}>{bill.status ?? 'Status unavailable'}</span>
      </div>
      <h3>{bill.title}</h3>
      <p>{bill.summary ?? 'A plain-language summary is not available.'}</p>
      <div className="bill-footer">
        <div className="sponsor"><span className="avatar">{bill.initials ?? '--'}</span><span>{bill.sponsor ?? 'Sponsor not available'}</span></div>
        <button className="card-link" type="button">View brief <ArrowIcon /></button>
      </div>
      <div className="bill-meta"><span>{bill.hearing ?? 'No upcoming meeting listed'}</span><span>{bill.votes ?? 'Vote information unavailable'}</span></div>
    </article>
  );
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <div className={`meeting ${meeting.active ? 'meeting-active' : ''}`}>
      <div className="meeting-time"><strong>{meeting.time}</strong><span>{meeting.meridiem}</span></div>
      <div className="meeting-info"><strong>{meeting.committee}</strong><span>{meeting.item}</span></div>
      <span className="room">{meeting.room}</span>
    </div>
  );
}

export function Dashboard() {
  const { topic, setTopic, query, setQuery, filteredBills, topics } = useDashboard();

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Beehive Brief home"><Mark /><span>Beehive<br /><b>Brief</b></span></a>
        <nav aria-label="Main navigation"><a className="active" href="#top">Dashboard</a><a href="#meetings">Meetings</a><a href="#about">About</a></nav>
        <button className="location" type="button"><span className="pin">⌖</span> Salt Lake County <span className="chevron">⌄</span></button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">UTAH LEGISLATURE · 2026 SESSION</p>
          <h1>Utah bills,<br /><em>clearly explained.</em></h1>
          <p className="lede">Follow what is moving at the Capitol and understand how it may affect the life you lead in Utah.</p>
          <label className="search"><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bills, topics, or sponsors" aria-label="Search bills, topics, or sponsors" /></label>
        </div>
        <aside className="session-card" aria-label="Session update">
          <div className="session-rule"></div>
          <p>THE WEEK AHEAD</p>
          <strong>12 bills</strong>
          <span>scheduled for committee discussion</span>
          <a href="#meetings">See today’s agenda <ArrowIcon /></a>
          <div className="mountains" aria-hidden="true"><span></span><span></span><span></span></div>
        </aside>
      </section>

      <section className="content-grid">
        <section className="watch-section" aria-labelledby="watch-title">
          <div className="section-heading"><div><p className="eyebrow">FOLLOW THE ACTION</p><h2 id="watch-title">Bills to watch</h2></div><button type="button" className="all-link">View all bills <ArrowIcon /></button></div>
          <div className="filters" aria-label="Bill topics">
            {topics.map((item) => <button key={item} className={topic === item ? 'selected' : ''} onClick={() => setTopic(item)} type="button">{item}</button>)}
          </div>
          <div className="bill-list">
            {filteredBills.length ? filteredBills.map((bill) => <BillCard key={bill.id} bill={bill} />) : <div className="empty"><strong>No bills found</strong><span>Try a different topic or search term.</span></div>}
          </div>
        </section>

        <aside className="right-rail" id="meetings">
          <section className="agenda-card">
            <div className="section-heading compact"><div><p className="eyebrow">AT THE CAPITOL</p><h2>Today’s agenda</h2></div><button type="button" className="calendar-button" aria-label="View calendar">▦</button></div>
            <div className="date-line"><span>Monday</span><strong>February 10</strong><span>3 meetings</span></div>
            <div className="meetings">{meetings.map((meeting) => <MeetingCard key={`${meeting.time}-${meeting.committee}`} meeting={meeting} />)}</div>
            <button className="agenda-link" type="button">Open full agenda <ArrowIcon /></button>
          </section>

          <section className="impact-card" id="about">
            <div className="impact-icon">✦</div>
            <p className="eyebrow">MAKE IT PERSONAL</p>
            <h2>How could a bill affect you?</h2>
            <p>Choose what matters to you and get a plain-language impact brief.</p>
            <div className="persona-row"><span>Renter</span><span>Parent</span><span>Taxpayer</span></div>
            <button type="button">Explore your impact <ArrowIcon /></button>
          </section>
        </aside>
      </section>

      <footer><span>Beehive Brief is a civic-information prototype. Bill summaries are for demonstration only.</span><span>Built for Crimson Hacks 2026</span></footer>
    </main>
  );
}
