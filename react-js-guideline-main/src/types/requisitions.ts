export interface JobLevelOption { value: string; label: string; range: string }

export interface RequisitionEnums {
	jobTypes: string[];
	priorities: string[];
	positionTypes: string[];
}

export type RequisitionStatus = 'Pending HR Approval' | 'Approved' | 'Rejected' | 'Draft';

export interface RequisitionDraftPayload {
    jobTitle: string;
    location: string;
    hiringManager: string;
    jobLevel?: string;
    jobType?: string;
    priority?: string;
    budget: number | '';
    description: string;
    hiringJustification?: string;
}

export interface RequisitionRecord extends RequisitionDraftPayload {
    id: string;
    number: string; // e.g., REQ-20251105-0001
    status: RequisitionStatus;
    openDate: string; // ISO date
    createdBy: string;
}

export type RequisitionStatus = 'Draft' | 'Pending HR Approval' | 'Approved' | 'Rejected';

export interface RequisitionSummary {
	id: string;
	number: string; // e.g., REQ-2025-0001
    title: string;
	status: RequisitionStatus;
	openDate: string; // ISO date
}


