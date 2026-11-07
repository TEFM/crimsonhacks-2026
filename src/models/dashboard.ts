import type { Bill, BillSeed } from './bills.js';

type SearchableBill = Pick<Bill, 'id' | 'title' | 'topic'> & Partial<Pick<BillSeed, 'sponsor'>>;

export function filterBills<T extends SearchableBill>(bills: readonly T[], topic: string, query: string): T[] {
  const normalizedQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';
  return bills.filter((bill) => {
    const matchesTopic = topic === 'All bills' || bill.topic === topic;
    const haystack = `${bill.id} ${bill.title} ${bill.sponsor} ${bill.topic}`.toLowerCase();
    return matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
}
