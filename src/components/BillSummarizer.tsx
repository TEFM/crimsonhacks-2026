import { useBillSummarizer } from '../controllers/useBillSummarizer';
import { personas } from '../models/billDetail';
import type { Bill } from '../models/types';

export function BillSummarizer({ bill }: { bill: Bill }) {
  const { state, summary, demographic, setDemographic, generate } = useBillSummarizer(bill);

  return <section className="detail-card summarizer-card" aria-labelledby="summarizer-title">
    <p className="eyebrow">GENERATED BILL BRIEF</p>
    <h2 id="summarizer-title">Bill summarizer</h2>
    <p className="summarizer-intro">Choose a demographic to translate the displayed bill scenario into a concise, labeled explanation.</p>
    <div className="demographic-picker" aria-label="Choose a demographic to translate for">{personas.map((persona) => <button className={demographic === persona ? 'selected' : ''} aria-pressed={demographic === persona} key={persona} type="button" onClick={() => setDemographic(persona)}>{persona}</button>)}</div>
    <button className="summarize-button" type="button" onClick={generate}>Translate for {demographic}</button>
    {state === 'ready' && summary ? <div className="generated-summary" aria-live="polite">
      <p>{summary.overview}</p>
      <div className="demographic-impact"><strong>What this could mean for a {summary.demographic}</strong><p>{summary.demographicImpact}</p></div>
      <ul>{summary.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
      <p className="disclaimer">{summary.limitations}</p>
    </div> : null}
    {state === 'unavailable' ? <p className="disclaimer" role="status">A translated brief is unavailable because this bill record does not include enough summary information. Use the official source below.</p> : null}
    <a className="source-link" href={bill.officialSource} target="_blank" rel="noreferrer">Read the official bill record</a>
  </section>;
}
