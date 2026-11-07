import { useMemo, useState } from 'react';
import { bills, topics } from '../models/bills';
import { filterBills } from '../models/dashboard';

export function useDashboard() {
  const [topic, setTopic] = useState('All bills');
  const [query, setQuery] = useState('');

  const filteredBills = useMemo(() => filterBills(bills, topic, query), [topic, query]);

  return { topic, setTopic, query, setQuery, filteredBills, topics };
}
