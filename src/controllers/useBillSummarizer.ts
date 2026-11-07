import { useCallback, useEffect, useState } from 'react';
import { summarizeBill, type BillSummary } from '../models/billSummarizer';
import type { Bill } from '../models/types';

export type SummaryState = 'idle' | 'ready' | 'unavailable';

export function useBillSummarizer(bill: Bill) {
  const [state, setState] = useState<SummaryState>('idle');
  const [summary, setSummary] = useState<BillSummary | null>(null);
  const [demographic, setDemographic] = useState('Renter');

  useEffect(() => {
    setState('idle');
    setSummary(null);
    setDemographic('Renter');
  }, [bill.id]);

  const generate = useCallback(() => {
    const nextSummary = summarizeBill(bill, demographic);
    setSummary(nextSummary);
    setState(nextSummary ? 'ready' : 'unavailable');
  }, [bill, demographic]);

  return { state, summary, demographic, setDemographic, generate };
}
