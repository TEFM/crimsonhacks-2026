export function calculateAnnualHouseholdImpact(annualProgramCost: number, affectedHouseholds: number): number | null;
export function calculateAnnualHouseholdImpact(annualProgramCost: number | undefined, affectedHouseholds: number | undefined): number | null;
export function calculateAnnualHouseholdImpact(annualProgramCost: number | undefined, affectedHouseholds: number | undefined): number | null {
  if (typeof annualProgramCost !== 'number' || !Number.isFinite(annualProgramCost) || annualProgramCost < 0
    || typeof affectedHouseholds !== 'number' || !Number.isFinite(affectedHouseholds) || affectedHouseholds <= 0) {
    return null;
  }

  const estimate = annualProgramCost / affectedHouseholds;
  return Number.isFinite(estimate) ? estimate : null;
}

/** Household counts are positive whole numbers; an empty input is never treated as zero. */
export function parseHouseholdCount(input: string): number | null {
  const trimmedInput = input.trim();
  if (!/^\d+$/.test(trimmedInput)) return null;
  const count = Number(trimmedInput);
  return Number.isSafeInteger(count) && count > 0 ? count : null;
}

export function getSimulatorSource(...candidates: readonly unknown[]): string | null {
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    try {
      const url = new URL(candidate);
      if (url.protocol === 'https:') return url.toString();
    } catch {
      // Continue to the next existing source; never invent a bill-specific URL.
    }
  }
  return null;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}
