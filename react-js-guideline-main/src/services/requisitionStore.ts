import type { RequisitionDraftPayload, RequisitionRecord, RequisitionStatus } from '../types/requisitions';

const STORAGE_KEY = 'requisitions';

function readAll(): RequisitionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RequisitionRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAll(records: RequisitionRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function pad(num: number, size = 4): string {
  return String(num).padStart(size, '0');
}

export function generateRequisitionNumber(existingCount?: number): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1, 2)}${pad(d.getDate(), 2)}`;
  const all = readAll();
  const seq = (existingCount ?? all.length) + 1;
  return `REQ-${ymd}-${pad(seq, 4)}`;
}

export function createRequisition(payload: RequisitionDraftPayload, createdBy: string): RequisitionRecord {
  const all = readAll();
  const record: RequisitionRecord = {
    ...payload,
    id: `${Date.now()}`,
    number: generateRequisitionNumber(all.length),
    status: 'Pending HR Approval',
    openDate: new Date().toISOString().slice(0, 10),
    createdBy
  };
  all.unshift(record);
  writeAll(all);
  return record;
}

export function listRequisitions(): RequisitionRecord[] {
  return readAll();
}

export function updateRequisitionStatus(id: string, status: RequisitionStatus): void {
  const all = readAll();
  const idx = all.findIndex(r => r.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], status };
    writeAll(all);
  }
}




