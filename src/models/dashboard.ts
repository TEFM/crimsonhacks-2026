import type { Bill, BillSeed } from './bills.js';

export function filterBills(bills: readonly (Bill | BillSeed)[], topic: string, query: string) {
  const normalizedQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';
  return bills.filter((bill) => {
    const matchesTopic = topic === 'All bills' || bill.topic === topic;
    const haystack = `${bill.id} ${bill.title} ${bill.sponsor} ${bill.topic}`.toLowerCase();
    return matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
}
