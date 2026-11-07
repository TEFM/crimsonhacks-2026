import { billRepository } from '../src/models/billRepository.js';
import { createOfficialRepository, createUtahLegislatureClient } from '../src/models/utahLegislatureClient.js';

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'public, max-age=300',
  'access-control-allow-origin': '*'
};

function response(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function requestedBillId(event) {
  const pathParameter = event?.pathParameters?.id;
  if (pathParameter) return pathParameter;
  const parts = typeof event?.rawPath === 'string' ? event.rawPath.split('/').filter(Boolean) : [];
  return parts.length > 2 ? parts.at(-1) : null;
}

/** AWS Lambda-compatible read-only bills endpoint.
 * GET /api/bills?topic=Housing&query=home
 * GET /api/bills/{id}
 */
export async function handler(event = {}) {
  if (event.requestContext?.http?.method && event.requestContext.http.method !== 'GET') {
    return response(405, { error: 'Only GET is supported.' });
  }

  const query = event.queryStringParameters ?? {};
  const id = requestedBillId(event);
  const officialClient = createUtahLegislatureClient();

  if (officialClient.isConfigured()) {
    try {
      if (id) {
        const bill = await officialClient.getBill(id);
        return bill ? response(200, { data: bill, meta: { source: 'official-utah-legislature-api' } }) : response(404, { error: 'Bill not found.' });
      }
      const repository = createOfficialRepository(await officialClient.listBills());
      return response(200, {
        data: repository.list({ topic: query.topic, query: query.query }),
        meta: { source: 'official-utah-legislature-api' }
      });
    } catch {
      // Continue serving the clearly labeled demo cache during an upstream outage.
      const fallback = id ? billRepository.findById(id) : null;
      if (id && !fallback) return response(503, { error: 'Official bill data is temporarily unavailable.' });
      if (id) return response(200, { data: fallback, meta: { source: 'cached-demo-fixture', notice: 'Official API unavailable.' } });
      return response(200, {
        data: billRepository.list({ topic: query.topic, query: query.query }),
        meta: { source: 'cached-demo-fixture', notice: 'Official API unavailable.' }
      });
    }
  }

  if (id) {
    const bill = billRepository.findById(id);
    return bill ? response(200, { data: bill }) : response(404, { error: 'Bill not found.' });
  }

  return response(200, {
    data: billRepository.list({ topic: query.topic, query: query.query }),
    meta: { source: 'cached-demo-fixture', generatedAt: new Date().toISOString() }
  });
}
