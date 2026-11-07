import { useBillDetail } from '../controllers/useBillDetail';
import { SiteHeader } from '../components/SiteHeader';
import { ArrowIcon } from '../components/ArrowIcon';
import { ImpactSimulator } from '../components/ImpactSimulator';
import { EffectiveDate } from '../components/EffectiveDate';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Bill } from '../models/types';

function SourceLink({ href, children = 'View official source' }: { href: string; children?: ReactNode }) {
  return <a className="source-link" href={href} target="_blank" rel="noreferrer">{children} <ArrowIcon /></a>;
}

function DetailHeader({ bill }: { bill: Bill }) {
  return <header className="detail-header">
    <a className="back-link" href="/">Back to dashboard</a>
    <div className="detail-topline"><span className="bill-id">{bill.id}</span><span className={`status ${bill.statusTone}`}>{bill.status}</span></div>
    <p className="eyebrow">UTAH LEGISLATURE - 2026 SESSION</p>
    <h1>{bill.title}</h1>
    <p className="detail-sponsor">Sponsored by {bill.sponsor}</p>
    <div className="detail-actions"><SourceLink href={bill.officialSource}>{bill.detail?.sourceLabel ?? 'Official Utah Legislature bill record'}</SourceLink><span>Last updated: fixture data</span></div>
  </header>;
}

function OfficialActivity({ bill }: { bill: Bill }) {
  const detail = bill.detail;
  return <section className="detail-card activity-card" aria-labelledby="activity-title">
    <p className="eyebrow">OFFICIAL ACTIVITY</p><h2 id="activity-title">Where it stands</h2>
    <p className="disclaimer"><span className="demo-badge">Demo fixture</span> Activity below is an unverified prototype preview. Confirm status and scheduling on the official legislative record.</p>
    <div className="activity-row"><span>Latest action</span><strong>{detail?.latestAction ?? 'Latest action is unavailable in this fixture.'}</strong></div>
    <div className="activity-row"><span>Next event</span><strong>{detail?.nextEvent ?? 'No upcoming meeting is available.'}</strong></div>
    <SourceLink href={bill.officialSource}>Open official bill record</SourceLink>
  </section>;
}

function Translator({ bill }: { bill: Bill }) {
  const detail = bill.detail;
  return <section className="detail-card translator-card" aria-labelledby="translation-title">
    <div className="card-title-row"><div><p className="eyebrow">AI-ASSISTED EXPLANATION</p><h2 id="translation-title">In plain language</h2></div><span className="demo-badge">Demo fixture</span></div>
    <p className="plain-summary">{detail?.plainSummary ?? 'A plain-language explanation is not available for this bill yet.'}</p>
    <div className="law-change"><h3>Current law to proposed change</h3>{detail?.currentVsProposed?.length ? detail.currentVsProposed.map(([label, description]) => <div className="change-row" key={label}><strong>{label}</strong><p>{description}</p></div>) : <p>Comparison unavailable.</p>}</div>
    <div className="affected"><h3>Who may be affected</h3><div>{detail?.affectedGroups?.length ? detail.affectedGroups.map((group) => <span key={group}>{group}</span>) : <span>Not yet specified</span>}</div></div>
    <EffectiveDate value={detail?.effectiveDate} />
    <SourceLink href={bill.officialSource}>Verify explanation and timing against official text</SourceLink>
    <p className="disclaimer">AI-assisted explanation for demonstration only. It is not legal or financial advice. Verify details against the official bill text and record.</p>
  </section>;
}

function PersonalImpact({ bill, personas, persona, setPersona, personaImpact }: { bill: Bill; personas: readonly string[]; persona: string; setPersona: Dispatch<SetStateAction<string>>; personaImpact: string }) {
  return <section className="detail-card personal-card" id="personal-impact" aria-labelledby="personal-title" tabIndex={-1}>
    <p className="eyebrow">MAKE IT PERSONAL</p><h2 id="personal-title">What could this mean for you?</h2>
    <div className="persona-picker" aria-label="Choose a persona">{personas.map((item) => <button className={persona === item ? 'selected' : ''} aria-pressed={persona === item} key={item} type="button" onClick={() => setPersona(item)}>{item}</button>)}</div>
    <div className="impact-answer" aria-live="polite" aria-atomic="true"><span>Viewing as a {persona}</span><p>{personaImpact}</p></div>
    <p className="disclaimer">This is an illustrative, AI-assisted impact view based on the demo fixture. Individual results may differ.</p>
  </section>;
}

function Votes({ bill }: { bill: Bill }) {
  const votes = bill.detail?.votes ?? [];
  return <section className="detail-card votes-card" aria-labelledby="votes-title"><p className="eyebrow">OFFICIAL VOTES</p><h2 id="votes-title">Action timeline</h2><p className="disclaimer"><span className="demo-badge">Demo fixture</span> Timeline entries and any vote totals are unverified prototype data. The official roll call controls.</p><div className="timeline">{votes.length ? votes.map((vote) => <div className="timeline-item" key={vote.stage}><span className={`timeline-dot ${vote.status.toLowerCase()}`}></span><div><div className="vote-stage"><strong>{vote.stage}</strong><span>{vote.status}</span></div><p>{vote.date} - {vote.result}</p></div></div>) : <p>No vote data is available in this fixture.</p>}</div><SourceLink href={bill.officialSource}>Verify votes on the official record</SourceLink></section>;
}

function ImpactSnapshot({ bill }: { bill: Bill }) {
  const fiscal = bill.detail?.fiscal;
  return <section className="detail-card fiscal-card" aria-labelledby="fiscal-title"><p className="eyebrow">OFFICIAL FISCAL NOTE</p><h2 id="fiscal-title">Impact snapshot</h2><div className="fiscal-values"><div><span>State cost</span><strong>{fiscal?.stateCost ?? 'Unavailable'}</strong></div><div><span>Local cost</span><strong>{fiscal?.localCost ?? 'Unavailable'}</strong></div></div><p>{fiscal?.note ?? 'No fiscal information is available.'}</p><SourceLink href={fiscal?.sourceUrl ?? bill.officialSource}>Review official sources for fiscal notes</SourceLink></section>;
}

function Historical({ bill }: { bill: Bill }) {
  const historical = bill.detail?.historical;
  return <section className="detail-card historical-card"><p className="eyebrow">HISTORICAL CONTEXT</p><h2>{historical?.title ?? 'Related prior-bill comparison'}</h2><p>{historical?.description ?? 'No verified historical comparison is available.'}</p><SourceLink href={historical?.sourceUrl ?? bill.officialSource}>Review official sources</SourceLink></section>;
}

export function BillDetail({ slug }: { slug: string }) {
  const { bill, persona, setPersona, personas, personaImpact } = useBillDetail(slug);
  if (!bill) return <main className="not-found"><a className="back-link" href="/">Back to dashboard</a><p className="eyebrow">BILL NOT FOUND</p><h1>We couldn't find that bill.</h1><p>Try returning to the dashboard and selecting one of the available demo bills.</p></main>;

  return <><SiteHeader activePage="" /><main className="detail-page"><DetailHeader bill={bill} /><div className="detail-grid"><div className="detail-primary"><OfficialActivity bill={bill} /><Translator bill={bill} /><Votes bill={bill} /><ImpactSnapshot bill={bill} /><Historical bill={bill} /></div><aside className="detail-rail"><PersonalImpact bill={bill} personas={personas} persona={persona} setPersona={setPersona} personaImpact={personaImpact} /><ImpactSimulator bill={bill} /></aside></div></main></>;
}
