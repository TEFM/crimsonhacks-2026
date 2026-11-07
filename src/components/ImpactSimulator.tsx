import { calculateAnnualHouseholdImpact, formatCurrency } from '../models/impactSimulator';
import { ArrowIcon } from './ArrowIcon';
import type { Bill } from '../models/types';

export function ImpactSimulator({ bill }: { bill: Bill }) {
  const simulator = bill.detail?.impactSimulator;
  const annualImpact = calculateAnnualHouseholdImpact(
    simulator?.annualProgramCost,
    simulator?.estimatedAffectedHouseholds
  );
  const fiscalSource = simulator?.fiscalNoteSourceUrl ?? bill.detail?.fiscal?.sourceUrl ?? bill.officialSource;

  return <section className="detail-card simulator-card" aria-labelledby="simulator-title">
    <p className="eyebrow">ILLUSTRATIVE ESTIMATE</p>
    <h2 id="simulator-title">Household impact simulator</h2>
    {annualImpact === null || !simulator ? <p className="simulator-empty">An estimate is unavailable because this fixture does not include usable cost and household inputs.</p> : <>
      <div className="simulator-result">
        <span>Estimated annual household impact</span>
        <strong>{formatCurrency(annualImpact)}<small> per household / year</small></strong>
      </div>
      <div className="simulator-inputs" aria-label="Illustrative calculation inputs">
        <div><span>Annual program cost</span><strong>{formatCurrency(simulator.annualProgramCost)}</strong></div>
        <div><span>Estimated affected households</span><strong>{simulator.estimatedAffectedHouseholds.toLocaleString('en-US')}</strong></div>
      </div>
      <p className="simulator-calculation">{formatCurrency(simulator.annualProgramCost)} ÷ {simulator.estimatedAffectedHouseholds.toLocaleString('en-US')} households = {formatCurrency(annualImpact)} per household each year</p>
    </>}
    <div className="simulator-assumptions"><strong>Assumptions & uncertainty</strong><p>{simulator?.assumptions ?? 'No estimate assumptions are available for this fixture.'}</p></div>
    <p className="disclaimer">Illustrative estimate—not a prediction or financial advice. Actual costs, funding sources, participation, and household effects may differ.</p>
    <a className="source-link" href={fiscalSource} target="_blank" rel="noreferrer">View fiscal-note source <ArrowIcon /></a>
  </section>;
}
