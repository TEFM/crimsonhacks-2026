import { useMemo, useState } from 'react';
import { findBillBySlug, getPersonaImpact, personas } from '../models/billDetail';
import { staticDataNotice } from './useDashboard';

export function useBillDetail(slug: string) {
  const fixtureBill = useMemo(() => findBillBySlug(slug), [slug]);
  const bill = fixtureBill;
  const [persona, setPersona] = useState('Renter');

  return {
    bill,
    persona,
    setPersona,
    personas,
    personaImpact: getPersonaImpact(bill, persona),
    dataNotice: staticDataNotice,
    isLoading: false
  };
}
