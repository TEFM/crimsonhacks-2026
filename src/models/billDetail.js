import { bills } from './bills.js';

export const personas = ['Renter', 'Homeowner', 'Parent', 'Small-business owner', 'Driver / commuter', 'Taxpayer'];

export function findBillBySlug(slug) {
  return bills.find((bill) => bill.slug === slug) ?? null;
}

export function getPersonaImpact(bill, persona) {
  return bill?.detail?.personaImpacts?.[persona]
    ?? 'A personalized impact explanation is not available for this bill yet. Review the official bill record for the latest information.';
}
