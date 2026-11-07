import test from 'node:test';
import assert from 'node:assert/strict';
import { findMeetingBySlug, getMeetingAgendaHref, getPrimaryMeeting } from '../src/models/meetingDetail.js';

test('findMeetingBySlug resolves a scheduled fixture agenda', () => {
  const meeting = findMeetingBySlug('house-land-use-feb-10-2026');
  assert.equal(meeting?.committee, 'House Land Use Committee');
  assert.equal(meeting?.scheduledBills?.[0]?.billSlug, 'hb-218');
});

test('meeting lookup safely returns null for an unknown agenda route', () => {
  assert.equal(findMeetingBySlug('not-a-real-meeting'), null);
});

test('agenda helpers favor today and safely fall back without a slug', () => {
  assert.equal(getPrimaryMeeting([{ timing: 'upcoming' }, { timing: 'today', slug: 'today' }])?.slug, 'today');
  assert.equal(getMeetingAgendaHref({ agendaSourceUrl: 'https://example.test/agenda' }), 'https://example.test/agenda');
  assert.equal(getMeetingAgendaHref({}), '/#meetings');
  assert.equal(getPrimaryMeeting(null), null);
});
