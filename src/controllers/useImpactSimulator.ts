import { useState } from 'react';
import { calculateAnnualHouseholdImpact, parseHouseholdCount } from '../models/impactSimulator';
import type { ImpactSimulatorData } from '../models/types';

export function useImpactSimulator(simulator: ImpactSimulatorData | undefined) {
  const initialHouseholds = simulator?.estimatedAffectedHouseholds;
  const defaultInput = typeof initialHouseholds === 'number' ? String(initialHouseholds) : '';
  const [householdInput, setHouseholdInput] = useState(defaultInput);
  const householdCount = parseHouseholdCount(householdInput);
  const fixtureIsUsable = parseHouseholdCount(defaultInput) !== null
    && calculateAnnualHouseholdImpact(simulator?.annualProgramCost, initialHouseholds) !== null;

  return {
    householdInput,
    setHouseholdInput,
    householdCount,
    fixtureIsUsable,
    annualImpact: fixtureIsUsable && householdCount !== null
      ? calculateAnnualHouseholdImpact(simulator?.annualProgramCost, householdCount)
      : null,
    resetHouseholds: () => setHouseholdInput(defaultInput)
  };
}
