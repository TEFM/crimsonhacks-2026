import { useBillDetail } from '../controllers/useBillDetail';
import { SiteHeader } from '../components/SiteHeader';
import { ArrowIcon } from '../components/ArrowIcon';

function SourceLink({ href, children = 'View official source' }) {
  return <a className="source-link" href={href} target="_blank" rel="noreferrer">{children} <ArrowIcon /></a>;
}

function DetailHeader({ bill }) {
  return <header className="detail-header">
    <a className="back-link" href="/">← Back to dashboard</a>
    <div className="detail-topline"><span className="bill-id">{bill.id}</span><span className={`status ${bill.statusTone}`}>{bill.status}</span></div>
    <p className="eyebrow">UTAH LEGISLATURE · 2026 SESSION</p>
    <h1>{bill.title}</h1>
    <p className="detail-sponsor">Sponsored by {bill.sponsor}</p>
    <div className="detail-actions"><SourceLink href={bill.officialSource}>{bill.detail?.sourceLabel ?? 'Official Utah Legislature bill record'}</SourceLink><span>Last updated: fixture data</span></div>
  </header>;
}

function OfficialActivity({ bill }) {
  const detail = bill.detail;
  return <section className="detail-card activity-card" aria-labelledby="activity-title">
    <p className="eyebrow">OFFICIAL ACTIVITY</p><h2 id="activity-title">Where it stands</h2>
    <div className="activity-row"><span>Latest action</span><strong>{detail?.latestAction ?? 'Latest action is unavailable in this fixture.'}</strong></div>
    <div className="activity-row"><span>Next event</span><strong>{detail?.nextEvent ?? 'No upcoming meeting is available.'}</strong></div>
    <SourceLink href={bill.officialSource}>Open official bill record</SourceLink>
  </section>;
}

function Translator({ bill }) {
  const detail = bill.detail;
  return <section className="detail-card translator-card" aria-labelledby="translation-title">
    <div className="card-title-row"><div><p className="eyebrow">AI-ASSISTED EXPLANATION</p><h2 id="translation-title">In plain language</h2></div><span className="demo-badge">Demo fixture</span></div>
    <p className="plain-summary">{detail?.plainSummary ?? 'A plain-language explanation is not available for this bill yet.'}</p>
    <div className="law-change"><h3>Current law → proposed change</h3>{detail?.currentVsProposed?.map(([label, description]) => <div className="change-row" key={label}><strong>{label}</strong><p>{description}</p></div>) ?? <p>Comparison unavailable.</p>}</div>
    <div className="affected"><h3>Who may be affected</h3><div>{detail?.affectedGroups?.map((group) => <span key={group}>{group}</span>) ?? <span>Not yet specified</span>}</div></div>
    <p className="disclaimer">AI-assisted explanation for demonstration only. It is not legal or financial advice. Verify details against the official bill text and record.</p>
  </section>;
}

function PersonalImpact({ bill, personas, persona, setPersona, personaImpact }) {
  return <section className="detail-card personal-card" aria-labelledby="personal-title">
    <p className="eyebrow">MAKE IT PERSONAL</p><h2 id="personal-title">What could this mean for you?</h2>
    <div className="persona-picker" aria-label="Choose a persona">{personas.map((item) => <button className={persona === item ? 'selected' : ''} key={item} type="button" onClick={() => setPersona(item)}>{item}</button>)}</div>
    <div className="impact-answer"><span>Viewing as a {persona}</span><p>{personaImpact}</p></div>
    <p className="disclaimer">This is an illustrative, AI-assisted impact view based on the demo fixture. Individual results may differ.</p>
  </section>;
}

function Votes({ bill }) {
  return <section className="detail-card votes-card" aria-labelledby="votes-title"><p className="eyebrow">OFFICIAL VOTES</p><h2 id="votes-title">Action timeline</h2><div className="timeline">{bill.detail?.votes?.map((vote) => <div className="timeline-item" key={vote.stage}><span className={`timeline-dot ${vote.status.toLowerCase()}`}></span><div><div className="vote-stage"><strong>{vote.stage}</strong><span>{vote.status}</span></div><p>{vote.date} · {vote.result}</p></div></div>) ?? <p>No vote data is available in this fixture.</p>}</div><SourceLink href={bill.officialSource}>Verify votes on the official record</SourceLink></section>;
}

function ImpactSnapshot({ bill }) {
  const fiscal = bill.detail?.fiscal;
  return <section className="detail-card fiscal-card" aria-labelledby="fiscal-title"><p className="eyebrow">OFFICIAL FISCAL NOTE</p><h2 id="fiscal-title">Impact snapshot</h2><div className="fiscal-values"><div><span>State cost</span><strong>{fiscal?.stateCost ?? 'Unavailable'}</strong></div><div><span>Local cost</span><strong>{fiscal?.localCost ?? 'Unavailable'}</strong></div></div><p>{fiscal?.note ?? 'No fiscal information is available.'}</p><SourceLink href={fiscal?.sourceUrl ?? bill.officialSource}>View fiscal-note source</SourceLink></section>;
}

function Historical({ bill }) {
  const historical = bill.detail?.historical;
  return <section className="detail-card historical-card"><p className="eyebrow">HISTORICAL CONTEXT</p><h2>{historical?.title ?? 'Related prior-bill comparison'}</h2><p>{historical?.description ?? 'No verified historical comparison is available.'}</p><SourceLink href={historical?.sourceUrl ?? bill.officialSource}>Review official sources</SourceLink></section>;
}

export function BillDetail({ slug }) {
  const { bill, persona, setPersona, personas, personaImpact } = useBillDetail(slug);
  if (!bill) return <main className="not-found"><a className="back-link" href="/">← Back to dashboard</a><p className="eyebrow">BILL NOT FOUND</p><h1>We couldn’t find that bill.</h1><p>Try returning to the dashboard and selecting one of the available demo bills.</p></main>;

  return <><SiteHeader activePage="" /><main className="detail-page"><DetailHeader bill={bill} /><div className="detail-grid"><div className="detail-primary"><OfficialActivity bill={bill} /><Translator bill={bill} /><Votes bill={bill} /></div><aside className="detail-rail"><PersonalImpact bill={bill} personas={personas} persona={persona} setPersona={setPersona} personaImpact={personaImpact} /><ImpactSnapshot bill={bill} /><Historical bill={bill} /></aside></div></main></>;
}
