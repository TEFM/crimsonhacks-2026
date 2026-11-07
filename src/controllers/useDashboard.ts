import { useMemo, useState } from 'react';
import { topics } from '../models/bills';
import { filterBills } from '../models/dashboard';
import { toBillViewModels } from '../models/presentationAdapters';

export function useDashboard() {
  const [topic, setTopic] = useState('All bills');
  const [query, setQuery] = useState('');

  const viewBills = useMemo(() => toBillViewModels(), []);
  const filteredBills = useMemo(() => filterBills(viewBills, topic, query), [viewBills, topic, query]);

  return { topic, setTopic, query, setQuery, filteredBills, topics };
}
