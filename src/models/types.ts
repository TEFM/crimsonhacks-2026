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
  currentVsProposed: readonly (readonly [string, string])[];
  affectedGroups: readonly string[];
  votes: readonly Vote[];
  fiscal: FiscalNote;
  impactSimulator: ImpactSimulatorData;
  personaImpacts: Record<string, string>;
  historical: HistoricalContext;
}

export interface Bill {
  id: string; slug?: string; title: string; topic: string; sponsor: string; status: string;
  statusTone: BillStatusTone; summary: string; hearing: string; updated: string; votes: string;
  initials: string; officialSource: string; detail?: BillDetailData;
}

export interface ScheduledBill { id?: string; title?: string; billSlug?: string; }
export type MeetingTiming = 'today' | 'next' | 'upcoming';
export interface Meeting {
  id: string; slug?: string; date?: string; time?: string; committee?: string; body?: string;
  room?: string; timing?: MeetingTiming; scheduledBills?: readonly ScheduledBill[];
  agendaSourceUrl?: string; sourceLabel?: string;
}
