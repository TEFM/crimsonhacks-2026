export function calculateAnnualHouseholdImpact(annualProgramCost: number, affectedHouseholds: number): number | null;
export function calculateAnnualHouseholdImpact(annualProgramCost: number | undefined, affectedHouseholds: number | undefined): number | null;
export function calculateAnnualHouseholdImpact(annualProgramCost: number | undefined, affectedHouseholds: number | undefined): number | null {
  if (typeof annualProgramCost !== 'number' || !Number.isFinite(annualProgramCost) || annualProgramCost < 0
    || typeof affectedHouseholds !== 'number' || !Number.isFinite(affectedHouseholds) || affectedHouseholds <= 0) {
    return null;
  }

  return annualProgramCost / affectedHouseholds;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}
