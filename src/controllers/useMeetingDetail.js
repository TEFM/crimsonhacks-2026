import { useMemo } from 'react';
import { findMeetingBySlug } from '../models/meetingDetail';

export function useMeetingDetail(slug) {
  return useMemo(() => ({ meeting: findMeetingBySlug(slug) }), [slug]);
}
