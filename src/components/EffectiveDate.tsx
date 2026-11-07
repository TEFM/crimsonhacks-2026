export function EffectiveDate({ value }: { value?: string }) {
  const effectiveDate = typeof value === 'string' ? value.trim() : '';
  return <div className="law-change effective-date">
    <h3>When could it begin?</h3>
    <p className="eyebrow">EFFECTIVE DATE - DEMO EXPLANATION</p>
    <p>{effectiveDate || 'Effective date unavailable in this fixture. Check the official bill text for timing.'}</p>
    <p>This timing is fixture-derived and has not been verified against official legislative records.</p>
  </div>;
}
