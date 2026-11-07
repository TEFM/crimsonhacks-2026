import { useEffect, useMemo, useState } from 'react';
import { topics } from '../models/bills.js';
import { billRepository } from '../models/billRepository.js';
import { fetchBills } from '../models/billsApi.js';
import { filterBills } from '../models/dashboard.js';

export function useDashboard() {
  const [topic, setTopic] = useState('All bills');
  const [query, setQuery] = useState('');
  const [loadedBills, setLoadedBills] = useState(() => billRepository.list());
  const [dataNotice, setDataNotice] = useState<string | null>('Showing cached demo fixtures until the live API is available.');
  const [isLoading, setIsLoading] = useState(Boolean(import.meta.env.VITE_BILLS_API_URL));

  useEffect(() => {
    let active = true;
    fetchBills()
      .then((result) => {
        if (!active) return;
        setLoadedBills(result.bills);
        setDataNotice(result.source === 'official-utah-legislature-api' ? null : result.notice ?? 'Official API unavailable; showing cached demo fixtures.');
      })
      .catch(() => {
        if (active) setDataNotice('Live bill data is unavailable; showing cached demo fixtures.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredBills = useMemo(() => filterBills(loadedBills, topic, query), [loadedBills, topic, query]);

  return { topic, setTopic, query, setQuery, filteredBills, topics, dataNotice, isLoading };
}
