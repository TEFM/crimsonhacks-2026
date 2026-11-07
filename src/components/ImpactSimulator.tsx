import { useImpactSimulator } from '../controllers/useImpactSimulator';
import { formatCurrency, getSimulatorSource } from '../models/impactSimulator';
import { ArrowIcon } from './ArrowIcon';
import type { Bill } from '../models/types';

export function ImpactSimulator({ bill }: { bill: Bill }) {
  // Reset a scenario when navigating to a different bill or fixture input set.
  const simulator = bill.detail?.impactSimulator;
  return <LocalImpactSimulator key={`${bill.id}:${simulator?.annualProgramCost}:${simulator?.estimatedAffectedHouseholds}`} bill={bill} />;
}

function LocalImpactSimulator({ bill }: { bill: Bill }) {
  const simulator = bill.detail?.impactSimulator;
  const { householdInput, setHouseholdInput, householdCount, fixtureIsUsable, annualImpact, resetHouseholds } = useImpactSimulator(simulator);
  const fiscalSource = getSimulatorSource(
    simulator?.fiscalNoteSourceUrl, bill.detail?.fiscal?.sourceUrl, bill.officialSource
  );
  const assumptions = typeof simulator?.assumptions === 'string' && simulator.assumptions.trim()
    ? simulator.assumptions : 'No estimate assumptions are available for this fixture.';

  return <section className="detail-card simulator-card" aria-labelledby="simulator-title">
    <p className="eyebrow">ILLUSTRATIVE ESTIMATE</p>
    <h2 id="simulator-title">Household impact simulator</h2>
    <p className="disclaimer">Local demo scenario: change the household count while keeping the hypothetical annual program cost fixed. These inputs and results are not official fiscal figures or a household bill.</p>
    {!fixtureIsUsable || !simulator ? <p className="simulator-empty">An estimate is unavailable because this fixture does not include usable cost and household inputs.</p> : <>
      <div className="simulator-inputs" aria-label="Illustrative calculation inputs">
        <div><span>Annual program cost (fixed)</span><strong>{formatCurrency(simulator.annualProgramCost)}</strong></div>
        <div><label htmlFor="simulator-households">Estimated affected households</label>
          <input id="simulator-households" className="simulator-household-input" type="number" inputMode="numeric" min="1" max={Number.MAX_SAFE_INTEGER} step="1"
            value={householdInput} onChange={(event) => setHouseholdInput(event.target.value)}
            aria-invalid={householdCount === null} aria-describedby="simulator-input-help" />
        </div>
      </div>
      <p className="simulator-calculation" id="simulator-input-help">Enter a positive whole number of households. Fixture starting count: {simulator.estimatedAffectedHouseholds.toLocaleString('en-US')}.</p>
      <button className="all-link" type="button" onClick={resetHouseholds}>Reset scenario</button>
      <div className="simulator-result" role="status" aria-live="polite" aria-atomic="true">
        {annualImpact === null || householdCount === null ? <p>Estimate unavailable. Enter a valid household count to calculate this scenario.</p> : <>
        <span>Estimated annual household impact</span>
        <strong>{formatCurrency(annualImpact)}<small> per household / year</small></strong>
        </>}
      </div>
      {annualImpact !== null && householdCount !== null && <p className="simulator-calculation">{formatCurrency(simulator.annualProgramCost)} / {householdCount.toLocaleString('en-US')} households = {formatCurrency(annualImpact)} per household each year</p>}
    </>}
    <div className="simulator-assumptions"><strong>Assumptions & uncertainty</strong><p>{assumptions}</p></div>
    <p className="disclaimer">Illustrative estimate - not a prediction or financial advice. Actual costs, funding sources, participation, and household effects may differ.</p>
    {fiscalSource ? <a className="source-link" href={fiscalSource} target="_blank" rel="noreferrer">Review official sources for fiscal notes <ArrowIcon /></a> : <p className="simulator-empty">Fiscal-note source unavailable.</p>}
  </section>;
}
