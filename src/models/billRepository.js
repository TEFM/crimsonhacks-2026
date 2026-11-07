import { bills } from './bills.js';

const BILL_ID_PATTERN = /^(HB|SB)\s+\d+$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function safeUrl(value) {
  if (!isNonEmptyString(value)) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function decodeBillId(value) {
  if (typeof value !== 'string') return '';
  try {
    return decodeURIComponent(value).trim().toUpperCase();
  } catch {
    return '';
  }
}

function textOr(value, fallback) {
  return isNonEmptyString(value) ? value.trim() : fallback;
}

function normalizeExplanation(value) {
  if (isNonEmptyString(value)) return {
    plainSummary: value.trim(),
    currentVsProposed: 'This cached fixture does not establish a verified current-law comparison.',
    affectedGroups: 'Affected groups must be verified against the official bill text.',
    effectiveDate: 'Effective date unavailable in this fixture.',
    uncertainties: 'This AI-assisted demo explanation is not legal or financial advice. Verify official records.'
  };
  if (!value || typeof value !== 'object') return null;
  return {
    plainSummary: textOr(value.plainSummary, 'A plain-language explanation is not available.'),
    currentVsProposed: textOr(value.currentVsProposed, 'A current-law comparison is not available.'),
    affectedGroups: textOr(value.affectedGroups, 'Affected groups are not available.'),
    effectiveDate: textOr(value.effectiveDate, 'Effective date unavailable.'),
    uncertainties: textOr(value.uncertainties, 'Verify all details against official legislative records.')
  };
}

function normalizePersonas(value) {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(Object.entries(value).filter(([, detail]) => isNonEmptyString(detail)).map(([name, detail]) => [name, detail.trim()]));
}

/**
 * Converts untrusted fixture or API data into the small shape our views can use.
 * Invalid records are excluded instead of being rendered as authoritative data.
 */
export function normalizeBill(record) {
  if (!record || typeof record !== 'object') return null;

  const id = isNonEmptyString(record.id) ? record.id.trim().toUpperCase() : '';
  if (!BILL_ID_PATTERN.test(id) || !isNonEmptyString(record.title) || !isNonEmptyString(record.topic)) {
    return null;
  }

  return {
    id,
    title: record.title.trim(),
    topic: record.topic.trim(),
    sponsor: isNonEmptyString(record.sponsor) ? record.sponsor.trim() : 'Sponsor not available',
    status: isNonEmptyString(record.status) ? record.status.trim() : 'Status unavailable',
    statusTone: isNonEmptyString(record.statusTone) ? record.statusTone.trim() : 'blue',
    summary: isNonEmptyString(record.summary) ? record.summary.trim() : 'A plain-language summary is not available.',
    hearing: isNonEmptyString(record.hearing) ? record.hearing.trim() : 'No upcoming meeting listed',
    updated: isNonEmptyString(record.updated) ? record.updated.trim() : 'Update time unavailable',
    votes: isNonEmptyString(record.votes) ? record.votes.trim() : 'Vote information unavailable',
    initials: isNonEmptyString(record.initials) ? record.initials.trim() : '--',
    officialSourceUrl: safeUrl(record.officialSourceUrl),
    officialTextUrl: safeUrl(record.officialTextUrl),
    sourceStatus: isNonEmptyString(record.sourceStatus) ? record.sourceStatus.trim() : 'Cached demo fixture',
    explanation: normalizeExplanation(record.explanation),
    personas: normalizePersonas(record.personas),
    timeline: Array.isArray(record.timeline) ? record.timeline.filter((item) => item && typeof item === 'object' && isNonEmptyString(item.label) && isNonEmptyString(item.detail)).map((item) => ({ label: item.label.trim(), detail: item.detail.trim(), date: textOr(item.date, 'Date unavailable') })) : [],
    historicalEffect: record.historicalEffect && typeof record.historicalEffect === 'object' ? { title: textOr(record.historicalEffect.title, 'Related prior bill'), detail: textOr(record.historicalEffect.detail, 'No verified comparison is available.'), sourceUrl: safeUrl(record.historicalEffect.sourceUrl) } : null,
    simulator: record.simulator && typeof record.simulator === 'object' && Number.isFinite(record.simulator.annualProgramCost) && Number.isFinite(record.simulator.affectedHouseholds) && record.simulator.affectedHouseholds > 0 ? { annualProgramCost: record.simulator.annualProgramCost, affectedHouseholds: record.simulator.affectedHouseholds, assumptions: textOr(record.simulator.assumptions, 'Illustrative inputs only.') } : null,
    uncertainty: isNonEmptyString(record.uncertainty) ? record.uncertainty.trim() : null,
    fiscalNote: record.fiscalNote && typeof record.fiscalNote === 'object' ? {
      stateCost: isNonEmptyString(record.fiscalNote.stateCost) ? record.fiscalNote.stateCost.trim() : 'Not available',
      localCost: isNonEmptyString(record.fiscalNote.localCost) ? record.fiscalNote.localCost.trim() : 'Not available',
      sourceUrl: safeUrl(record.fiscalNote.sourceUrl)
    } : null
  };
}

export function createBillRepository(records = bills) {
  const validBills = records.map(normalizeBill).filter(Boolean);

  return {
    list({ topic = 'All bills', query = '' } = {}) {
      const normalizedQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';
      return validBills.filter((bill) => {
        const matchesTopic = topic === 'All bills' || bill.topic === topic;
        const searchable = `${bill.id} ${bill.title} ${bill.sponsor} ${bill.topic}`.toLowerCase();
        return matchesTopic && (!normalizedQuery || searchable.includes(normalizedQuery));
      });
    },
    findById(id) {
      const normalizedId = decodeBillId(id);
      return validBills.find((bill) => bill.id === normalizedId) ?? null;
    }
  };
}

export const billRepository = createBillRepository();
