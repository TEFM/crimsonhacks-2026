import { useMemo, useState } from 'react';
import { findBillBySlug, getPersonaImpact, personas } from '../models/billDetail';

export function useBillDetail(slug) {
  const bill = useMemo(() => findBillBySlug(slug), [slug]);
  const [persona, setPersona] = useState('Renter');

  return {
    bill,
    persona,
    setPersona,
    personas,
    personaImpact: getPersonaImpact(bill, persona)
  };
}
