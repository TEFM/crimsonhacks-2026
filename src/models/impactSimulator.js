export function calculateAnnualHouseholdImpact(annualProgramCost, affectedHouseholds) {
  if (!Number.isFinite(annualProgramCost) || annualProgramCost < 0
    || !Number.isFinite(affectedHouseholds) || affectedHouseholds <= 0) {
    return null;
  }

  return annualProgramCost / affectedHouseholds;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}
