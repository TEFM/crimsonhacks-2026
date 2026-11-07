import { useMemo, useReducer } from 'react';
import { topics } from '../models/bills';
import { dashboardFiltersReducer, filterBills, initialDashboardFilters } from '../models/dashboard';
import { toBillViewModels } from '../models/presentationAdapters';

export function useDashboard() {
  const [{ topic, query }, dispatch] = useReducer(dashboardFiltersReducer, initialDashboardFilters);
  const setTopic = (selectedTopic: string) => dispatch({ type: 'set-topic', topic: selectedTopic });
  const setQuery = (searchQuery: string) => dispatch({ type: 'set-query', query: searchQuery });
  const resetFilters = () => dispatch({ type: 'reset' });

  const viewBills = useMemo(() => toBillViewModels(), []);
  const filteredBills = useMemo(() => filterBills(viewBills, topic, query), [viewBills, topic, query]);

  return { topic, setTopic, query, setQuery, resetFilters, filteredBills, topics };
}
