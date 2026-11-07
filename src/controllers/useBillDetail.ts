import { useEffect, useMemo, useState } from 'react';
import { billIdFromSlug, findBillBySlug, getPersonaImpact, personas } from '../models/billDetail';
import { fetchBill } from '../models/billsApi';
import { toBillViewModel } from '../models/presentationAdapters';

export function useBillDetail(slug: string) {
  const fixtureBill = useMemo(() => findBillBySlug(slug), [slug]);
  const [bill, setBill] = useState(fixtureBill);
  const [dataNotice, setDataNotice] = useState<string | null>('Showing cached demo fixture until the live API is available.');
  const [isLoading, setIsLoading] = useState(Boolean(import.meta.env?.VITE_BILLS_API_URL));
  const [persona, setPersona] = useState('Renter');

  useEffect(() => {
    const id = billIdFromSlug(slug);
    let active = true;
    setBill(fixtureBill);
    setIsLoading(Boolean(import.meta.env?.VITE_BILLS_API_URL));
    setDataNotice('Showing cached demo fixture until the live API is available.');
    if (!id) {
      setIsLoading(false);
      return () => { active = false; };
    }

    fetchBill(id).then((result) => {
      if (!active) return;
      setBill(toBillViewModel(result.bill));
      setDataNotice(result.source === 'official-utah-legislature-api'
        ? 'Showing this bill from the official Utah Legislature API.'
        : result.notice ?? 'Official API unavailable; showing a cached demo fixture.');
    }).catch(() => {
      if (active) setDataNotice('Live bill data is unavailable; showing a cached demo fixture.');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, [fixtureBill, slug]);

  return {
    bill,
    persona,
    setPersona,
    personas,
    personaImpact: getPersonaImpact(bill, persona),
    dataNotice,
    isLoading
  };
}
