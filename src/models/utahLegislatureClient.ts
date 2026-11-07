import { createBillRepository, normalizeBill } from './billRepository.js';
import type { Bill } from './bills.js';

const DEFAULT_BASE_URL = 'https://glen.le.utah.gov';
const DEFAULT_SESSION = '2026GS';
const BILL_LIST_CACHE_MS = 60 * 60 * 1000;

type UnknownRecord = Record<string, unknown>;
type FetchResponse = { ok: boolean; status: number; json: () => Promise<unknown> };
type FetchImplementation = (url: string) => Promise<FetchResponse>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object';
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

function firstText(record: unknown, fields: readonly string[]): string | null {
  if (!isRecord(record)) return null;
  for (const field of fields) {
    if (typeof record?.[field] === 'string' && record[field].trim()) return record[field].trim();
  }
  return null;
}

export function toOfficialBillKey(id: unknown): string | null {
  const match = typeof id === 'string' && id.trim().toUpperCase().match(/^(HB|SB)\s*(\d+)$/);
  return match ? `${match[1]}${match[2].padStart(4, '0')}` : null;
}

/** Converts only named API fields; no summaries, fiscal values, or votes are inferred. */
export function mapOfficialBill(record: unknown): Bill | null {
  const billKey = firstText(record, ['BillNumber', 'billNumber', 'Bill', 'bill', 'Number', 'number']);
  const match = billKey?.toUpperCase().match(/^(HB|SB)\s*0*(\d+)$/);
  const title = firstText(record, ['ShortTitle', 'shortTitle', 'Title', 'title', 'LongTitle', 'longTitle']);
  if (!match || !title) return null;

  const rawSponsor = firstText(record, ['Sponsor', 'sponsor', 'SponsorName', 'sponsorName']);
  const sponsor = rawSponsor ?? 'Sponsor not supplied by official feed';
  const status = firstText(record, ['Status', 'status', 'CurrentStatus', 'currentStatus']) ?? 'Status not supplied by official feed';
  const officialSourceUrl = firstText(record, ['Url', 'url', 'BillUrl', 'billUrl', 'Link', 'link']);

  return normalizeBill({
    id: `${match[1]} ${Number(match[2])}`,
    title,
    topic: firstText(record, ['Topic', 'topic', 'Category', 'category']) ?? 'Legislation',
    sponsor,
    status,
    statusTone: 'blue',
    summary: 'Official bill data retrieved from the Utah Legislature API. Read the official bill text for legal details.',
    hearing: 'No upcoming meeting supplied by this bill endpoint',
    updated: firstText(record, ['Updated', 'updated', 'LastUpdated', 'lastUpdated', 'UpdateDate', 'updateDate']) ?? 'Update time not supplied',
    votes: 'Vote information is not supplied by this bill endpoint',
    initials: sponsor.split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase() || '--',
    officialSourceUrl,
    sourceStatus: 'Official Utah Legislature API'
  });
}

function recordsFromPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) throw new Error('Utah Legislature API returned an unexpected bill-list shape.');
  for (const key of ['Bills', 'bills', 'BillList', 'billList']) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  throw new Error('Utah Legislature API returned an unexpected bill-list shape.');
}

export interface UtahLegislatureClientOptions {
  token?: string;
  session?: string;
  baseUrl?: string;
  fetchImpl?: FetchImplementation;
  now?: () => number;
}

export function createUtahLegislatureClient({
  token = process.env.UTAH_LEGISLATURE_DEVELOPER_TOKEN,
  session = process.env.UTAH_LEGISLATURE_SESSION || DEFAULT_SESSION,
  baseUrl = DEFAULT_BASE_URL,
  fetchImpl = globalThis.fetch as FetchImplementation,
  now = () => Date.now()
}: UtahLegislatureClientOptions = {}) {
  const safeToken = typeof token === 'string' ? token.trim() : '';
  let cachedList: { bills: Bill[]; fetchedAt: number } | null = null;

  async function fetchJson(path: string): Promise<unknown> {
    requiredString(safeToken, 'UTAH_LEGISLATURE_DEVELOPER_TOKEN');
    if (typeof fetchImpl !== 'function') throw new Error('Fetch is unavailable in this runtime.');
    const response = await fetchImpl(`${baseUrl}/bills/${encodeURIComponent(session)}/${path}/${encodeURIComponent(safeToken)}`);
    if (!response.ok) throw new Error(`Utah Legislature API request failed (${response.status}).`);
    return response.json();
  }

  return {
    isConfigured: () => Boolean(safeToken),
    async listBills() {
      if (cachedList && now() - cachedList.fetchedAt < BILL_LIST_CACHE_MS) return cachedList.bills;
      const payload = await fetchJson('billlist');
      const bills = recordsFromPayload(payload).map(mapOfficialBill).filter((bill): bill is Bill => bill !== null);
      cachedList = { bills, fetchedAt: now() };
      return bills;
    },
    async getBill(id: unknown): Promise<Bill | null> {
      const billKey = toOfficialBillKey(id);
      if (!billKey) return null;
      const payload = await fetchJson(billKey);
      let record = Array.isArray(payload) ? payload[0] : payload;
      if (!Array.isArray(payload)) {
        try {
          record = recordsFromPayload(payload)[0];
        } catch {
          // A detail response may be a single bill object rather than a list wrapper.
        }
      }
      return mapOfficialBill(record);
    }
  };
}

export function createOfficialRepository(records: readonly unknown[]) {
  return createBillRepository(records);
}
