export interface BillSearchRecord {
  id: string;
  title: string;
  sponsor: string;
  topic: string;
}

export interface DashboardFilters {
  topic: string;
  query: string;
}

export type DashboardFilterAction =
  | { type: 'set-topic'; topic: string }
  | { type: 'set-query'; query: string }
  | { type: 'reset' };

export const initialDashboardFilters: DashboardFilters = { topic: 'All bills', query: '' };

export function dashboardFiltersReducer(state: DashboardFilters, action: DashboardFilterAction): DashboardFilters {
  switch (action.type) {
    case 'set-topic': return { ...state, topic: action.topic };
    case 'set-query': return { ...state, query: action.query };
    case 'reset': return { ...initialDashboardFilters };
  }
}

export function filterBills<T extends BillSearchRecord>(bills: readonly T[], topic: string, query: string): T[] {
  const normalizedQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';
  return bills.filter((bill) => {
    const matchesTopic = topic === 'All bills' || bill.topic === topic;
    const haystack = `${bill.id} ${bill.title} ${bill.sponsor} ${bill.topic}`.toLowerCase();
    return matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
}
