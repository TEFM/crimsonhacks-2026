import type { Bill } from './types';

export interface BillSummary {
  overview: string;
  demographic: string;
  demographicImpact: string;
  keyPoints: readonly string[];
  limitations: string;
}

function meaningful(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed && !/not available|unavailable|not yet specified/i.test(trimmed) ? trimmed : null;
}

/** Produces a bounded, traceable overview from the displayed bill record only. */
export function summarizeBill(bill: Bill, demographic: string): BillSummary | null {
  const description = meaningful(bill.detail?.plainSummary) ?? meaningful(bill.summary);
  if (!description) return null;

  const demographicImpact = bill.detail?.personaImpacts?.[demographic]?.trim()
    || 'A demographic-specific explanation is not available for this bill record. Review the official bill record for details.';

  const keyPoints = [
    `Current status: ${bill.status}.`,
    ...((bill.detail?.affectedGroups ?? []).slice(0, 3).map((group) => `May affect: ${group}.`)),
    ...(meaningful(bill.detail?.effectiveDate) ? [`Listed effective date: ${bill.detail?.effectiveDate}.`] : [])
  ];

  return {
    overview: description,
    demographic,
    demographicImpact,
    keyPoints,
    limitations: 'This translator uses the displayed fixture scenario for the selected demographic, not a full legal-text review or a personal prediction. Confirm the bill text, status, timing, and fiscal effects with the official Utah Legislature record.'
  };
}
