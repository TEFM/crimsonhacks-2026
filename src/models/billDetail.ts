import { toBillViewModels } from './presentationAdapters';
import type { Bill } from './types';

export const personas = ['Renter', 'Homeowner', 'Parent', 'Small-business owner', 'Driver / commuter', 'Taxpayer'];

export function findBillBySlug(slug: string): Bill | null {
  return toBillViewModels().find((bill) => bill.slug === slug) ?? null;
}

export function getPersonaImpact(bill: Bill | null | undefined, persona: string): string {
  return bill?.detail?.personaImpacts?.[persona]
    ?? 'A personalized impact explanation is not available for this bill yet. Review the official bill record for the latest information.';
}
