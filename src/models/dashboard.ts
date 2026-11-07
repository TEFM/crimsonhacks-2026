export interface BillSearchRecord {
  id: string;
  title: string;
  sponsor: string;
  topic: string;
}

export function filterBills<T extends BillSearchRecord>(bills: readonly T[], topic: string, query: string): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  return bills.filter((bill) => {
    const matchesTopic = topic === 'All bills' || bill.topic === topic;
    const haystack = `${bill.id} ${bill.title} ${bill.sponsor} ${bill.topic}`.toLowerCase();
    return matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
}
