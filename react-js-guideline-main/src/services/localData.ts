import type { RequisitionSummary, RequisitionStatus } from '../types/requisitions';

const REQS_KEY = 'requisitions';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getRequisitions(): RequisitionSummary[] {
  return read<RequisitionSummary[]>(REQS_KEY, []);
}

function pad(n: number, width: number = 4): string {
  return n.toString().padStart(width, '0');
}

function generateRequisitionNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const seq = getRequisitions().length + 1;
  return `REQ-${year}-${pad(seq)}`;
}

export function addRequisition(input: { title: string }): RequisitionSummary {
  const all = getRequisitions();
  const req: RequisitionSummary = {
    id: `${Date.now()}`,
    number: generateRequisitionNumber(),
    title: input.title,
    status: 'Pending HR Approval',
    openDate: new Date().toISOString().slice(0, 10)
  };
  all.unshift(req);
  write(REQS_KEY, all);
  return req;
}

export function updateRequisitionStatus(id: string, status: RequisitionStatus): void {
  const all = getRequisitions();
  const idx = all.findIndex(r => r.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], status };
    write(REQS_KEY, all);
  }
}


