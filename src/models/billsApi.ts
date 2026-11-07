import { normalizeBill } from './billRepository.js';
import type { Bill } from './bills.js';

export interface BillsApiResult {
  bills: Bill[];
  source: 'official-utah-legislature-api' | 'cached-demo-fixture';
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
    return url.protocol === 'https:' ? url.toString().replace(/\/$/, '') : null;
  } catch {
    return null;
  }
}

/** Reads only a public API Gateway URL; protected Utah credentials remain in Lambda. */
export async function fetchBills({
  endpoint,
  fetchImpl = globalThis.fetch as FetchImplementation
}: {
  endpoint?: string;
  fetchImpl?: FetchImplementation;
} = {}): Promise<BillsApiResult> {
  const apiEndpoint = normalizeEndpoint(endpoint ?? import.meta.env?.VITE_BILLS_API_URL);
  if (!apiEndpoint) throw new Error('Live bills API is not configured.');
  if (typeof fetchImpl !== 'function') throw new Error('Fetch is unavailable in this browser.');

  const response = await fetchImpl(`${apiEndpoint}/api/bills`);
  if (!response.ok) throw new Error(`Live bills API request failed (${response.status}).`);

  const payload = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.data) || !isRecord(payload.meta)) {
    throw new Error('Live bills API returned an unexpected response shape.');
  }

  const source = payload.meta.source;
  if (source !== 'official-utah-legislature-api' && source !== 'cached-demo-fixture') {
    throw new Error('Live bills API did not identify its data source.');
  }

  return {
    bills: payload.data.map(normalizeBill).filter((bill): bill is Bill => bill !== null),
    source,
    notice: typeof payload.meta.notice === 'string' ? payload.meta.notice : null
  };
}
