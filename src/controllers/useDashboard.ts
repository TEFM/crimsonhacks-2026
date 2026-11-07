import { useEffect, useMemo, useReducer, useState } from 'react';
import { topics } from '../models/bills';
import { billRepository } from '../models/billRepository';
import { fetchBills } from '../models/billsApi';
import { dashboardFiltersReducer, filterBills, initialDashboardFilters } from '../models/dashboard';
import { toBillViewModels } from '../models/presentationAdapters';

export function useDashboard() {
  const [{ topic, query }, dispatch] = useReducer(dashboardFiltersReducer, initialDashboardFilters);
  const setTopic = (selectedTopic: string) => dispatch({ type: 'set-topic', topic: selectedTopic });
  const setQuery = (searchQuery: string) => dispatch({ type: 'set-query', query: searchQuery });
  const resetFilters = () => dispatch({ type: 'reset' });
  const [loadedBills, setLoadedBills] = useState(() => billRepository.list());
  const [dataNotice, setDataNotice] = useState<string | null>('Showing cached demo fixtures until the live API is available.');
  const [isLoading, setIsLoading] = useState(Boolean(import.meta.env?.VITE_BILLS_API_URL));

  useEffect(() => {
    let active = true;
    fetchBills().then((result) => {
      if (!active) return;
      setLoadedBills(result.bills);
      setDataNotice(result.source === 'official-utah-legislature-api'
        ? 'Showing records from the official Utah Legislature API.'
        : result.notice ?? 'Official API unavailable; showing cached demo fixtures.');
    }).catch(() => {
      if (active) setDataNotice('Live bill data is unavailable; showing cached demo fixtures.');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const viewBills = useMemo(() => toBillViewModels(loadedBills), [loadedBills]);
  const filteredBills = useMemo(() => filterBills(viewBills, topic, query), [viewBills, topic, query]);

  return { topic, setTopic, query, setQuery, resetFilters, filteredBills, topics, dataNotice, isLoading };
}
