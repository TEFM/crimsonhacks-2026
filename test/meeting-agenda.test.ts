import test from 'node:test';
import assert from 'node:assert/strict';
import { toMeetingViewModels } from '../src/models/presentationAdapters.js';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MeetingAgenda } from '../src/components/MeetingAgenda.js';
import { getMeetingKind, getMeetingTiming } from '../src/models/meetingDetail.js';

test('fixture agenda distinguishes today, next, upcoming and includes the existing floor-calendar scenario', () => {
  const meetings = toMeetingViewModels();
  assert.deepEqual(meetings.slice(0, 3).map((meeting) => meeting.slug), [
    'house-land-use-feb-10-2026', 'natural-resources-committee-2', 'education-committee-3'
  ]);
  assert.deepEqual(meetings.slice(0, 3).map((meeting) => meeting.timing), ['today', 'next', 'upcoming']);
  const floor = meetings.find((meeting) => meeting.body === 'Floor calendar');
  assert.equal(floor?.scheduledBills?.[0]?.billSlug, 'sb-142');
  assert.equal(floor?.agendaSourceUrl, 'https://le.utah.gov/');
  assert.match(floor?.sourceLabel ?? '', /prototype|fixture/i);
});

test('agenda renders semantic timing sections, meeting kinds, and existing agenda links', () => {
  const html = renderToStaticMarkup(createElement(MeetingAgenda, { meetings: toMeetingViewModels() }));
  for (const timing of ['today', 'next', 'upcoming']) {
    assert.match(html, new RegExp(`aria-labelledby="agenda-${timing}"`));
    assert.match(html, new RegExp(`class="meeting meeting-${timing}"`));
  }
  assert.match(html, /Committee meeting/);
  assert.match(html, /Floor calendar/);
  assert.match(html, /not the live calendar/);
  assert.match(html, /href="\/meetings\/house-land-use-feb-10-2026"/);
  assert.match(html, /href="\/meetings\/senate-floor-sb-142-fixture"/);
});

test('agenda empty and partial states retain useful safe fallbacks', () => {
  for (const meetings of [undefined, null, []]) {
    const html = renderToStaticMarkup(createElement(MeetingAgenda, { meetings }));
    assert.match(html, /No upcoming meetings or floor-calendar items/);
    assert.doesNotMatch(html, /Open full agenda/);
  }
  const html = renderToStaticMarkup(createElement(MeetingAgenda, { meetings: [{ id: 'partial' }] }));
  assert.match(html, /Time TBD/);
  assert.match(html, /Agenda items unavailable/);
  assert.match(html, /Location TBD/);
  assert.match(html, /Meeting details unavailable/);
  assert.equal(getMeetingTiming({}), 'upcoming');
  assert.equal(getMeetingKind({ committee: 'Senate floor' }), 'Floor calendar');
});

test('fixture agenda keeps floor routes resolvable and permits an empty schedule', async () => {
  const { findMeetingBySlug } = await import('../src/models/meetingDetail.js');
  assert.equal(findMeetingBySlug('senate-floor-sb-142-fixture')?.body, 'Floor calendar');
  assert.deepEqual(toMeetingViewModels([]), []);
});

test('meeting adapter safely handles absent optional agenda content', () => {
  const entries = toMeetingViewModels([{ committee: 'Empty committee' } as import('../src/models/bills.js').Meeting]);
  assert.equal(entries[0].time, undefined);
  assert.deepEqual(entries[0].scheduledBills, []);
});
