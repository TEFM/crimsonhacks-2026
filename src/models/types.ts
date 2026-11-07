export type BillStatusTone = 'amber' | 'blue' | 'green' | 'crimson';

export interface Vote { stage: string; result: string; date: string; status: string; }
export interface FiscalNote { stateCost: string; localCost: string; note: string; sourceUrl: string; }
export interface ImpactSimulatorData { annualProgramCost: number; estimatedAffectedHouseholds: number; assumptions: string; fiscalNoteSourceUrl: string; }
export interface HistoricalContext { title: string; description: string; sourceUrl: string; }

export interface BillDetailData {
  latestAction: string;
  nextEvent: string;
  sourceLabel: string;
  plainSummary: string;
  effectiveDate?: string;
  currentVsProposed: readonly (readonly [string, string])[];
  affectedGroups: readonly string[];
  votes: readonly Vote[];
  fiscal: FiscalNote;
  impactSimulator?: ImpactSimulatorData;
  personaImpacts: Record<string, string>;
  historical?: HistoricalContext;
}

export interface Bill {
  id: string; slug?: string; title: string; topic: string; sponsor: string; status: string;
  statusTone: BillStatusTone; summary: string; hearing: string; updated: string; votes: string;
  initials: string; officialSource: string; dataOrigin: BillDataOrigin; capturedAt?: string; detail?: BillDetailData;
}

/** Provenance is displayed with every cached record; it is never inferred from generated text. */
export type BillDataOrigin = 'prototype-fixture' | 'official-snapshot';

export interface FixtureFiscalNote { stateCost: string; localCost: string; sourceUrl: string | null; }
export interface FixtureExplanation { plainSummary: string; currentVsProposed: string; affectedGroups: string; effectiveDate: string; uncertainties: string; }
export interface FixtureTimelineEvent { label: string; detail: string; date: string; }
export interface BillSeed {
  id: string; slug?: string; title: string; topic: string; sponsor?: string; status?: string;
  statusTone?: BillStatusTone; summary?: string; hearing?: string; updated?: string; votes?: string;
  initials?: string; officialSourceUrl?: string | null; officialTextUrl?: string | null;
  sourceStatus?: string; explanation?: FixtureExplanation | string; personas?: Record<string, string>;
  dataOrigin?: BillDataOrigin; capturedAt?: string;
  timeline?: readonly FixtureTimelineEvent[];
  historicalEffect?: { title: string; detail: string; sourceUrl: string | null } | null;
  simulator?: { annualProgramCost: number; affectedHouseholds: number; assumptions: string } | null;
  uncertainty?: string | null; fiscalNote?: FixtureFiscalNote | null; detail?: Partial<BillDetailData>;
}

export interface ScheduledBill { id?: string; title?: string; billSlug?: string; }
export type MeetingTiming = 'today' | 'next' | 'upcoming';
export interface Meeting { id: string; slug?: string; date?: string; time?: string; committee?: string; body?: string; room?: string; timing?: MeetingTiming; scheduledBills?: readonly ScheduledBill[]; agendaSourceUrl?: string; sourceLabel?: string; }
