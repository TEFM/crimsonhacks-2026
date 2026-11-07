import { normalizeBill } from './billRepository.js';
import type { Bill } from './bills.js';

export interface BillsApiResult {
  bills: Bill[];
  source: 'official-utah-legislature-api' | 'cached-demo-fixture';
  notice: string | null;
}

export interface BillApiResult {
  bill: Bill;
  source: BillsApiResult['source'];
  notice: string | null;
}

export interface FetchResponseLike {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}

export type FetchImplementation = (url: string) => Promise<FetchResponseLike>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function normalizeEndpoint(endpoint: string | undefined): string | null {
  if (!endpoint?.trim()) return null;
  try {
    const url = new URL(endpoint);
    const isLocalDevelopmentHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '[::1]';
    return url.protocol === 'https:' || (url.protocol === 'http:' && isLocalDevelopmentHost)
      ? url.toString().replace(/\/$/, '')
      : null;
  } catch {
    return null;
  }
}

function apiEndpoint(endpoint: string | undefined): string {
  const normalized = normalizeEndpoint(endpoint ?? import.meta.env?.VITE_BILLS_API_URL);
  if (!normalized) throw new Error('Live bills API is not configured.');
  return normalized;
}

function readPayload(payload: unknown): { data: unknown; source: BillsApiResult['source']; notice: string | null } {
  if (!isRecord(payload) || !isRecord(payload.meta)) {
    throw new Error('Live bills API returned an unexpected response shape.');
  }
  const source = payload.meta.source;
  if (source !== 'official-utah-legislature-api' && source !== 'cached-demo-fixture') {
    throw new Error('Live bills API did not identify its data source.');
  }
  return { data: payload.data, source, notice: typeof payload.meta.notice === 'string' ? payload.meta.notice : null };
}

/** Reads only a public API Gateway URL; protected Utah credentials remain in Lambda. */
export async function fetchBills({
  endpoint,
  fetchImpl = globalThis.fetch as FetchImplementation
}: {
  endpoint?: string;
  fetchImpl?: FetchImplementation;
} = {}): Promise<BillsApiResult> {
  const baseUrl = apiEndpoint(endpoint);
  if (typeof fetchImpl !== 'function') throw new Error('Fetch is unavailable in this browser.');

  const response = await fetchImpl(`${baseUrl}/api/bills`);
  if (!response.ok) throw new Error(`Live bills API request failed (${response.status}).`);

  const payload = readPayload(await response.json());
  if (!Array.isArray(payload.data)) {
    throw new Error('Live bills API returned an unexpected response shape.');
  }

  return {
    bills: payload.data.map(normalizeBill).filter((bill): bill is Bill => bill !== null),
    source: payload.source,
    notice: payload.notice
  };
}

/** Fetches one bill for a directly opened detail URL using the public API Gateway. */
export async function fetchBill(id: string, {
  endpoint,
  fetchImpl = globalThis.fetch as FetchImplementation
}: {
  endpoint?: string;
  fetchImpl?: FetchImplementation;
} = {}): Promise<BillApiResult> {
  const baseUrl = apiEndpoint(endpoint);
  if (typeof fetchImpl !== 'function') throw new Error('Fetch is unavailable in this browser.');
  const response = await fetchImpl(`${baseUrl}/api/bills/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error(`Live bill API request failed (${response.status}).`);

  const payload = readPayload(await response.json());
  const bill = normalizeBill(payload.data);
  if (!bill) throw new Error('Live bill API returned an unexpected response shape.');
  return { bill, source: payload.source, notice: payload.notice };
}
