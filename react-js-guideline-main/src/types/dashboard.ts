export interface DashboardKpis {
	openRoles: { value: number; delta: string };
	avgTimeToHireDays: { value: number; delta: string };
	pipelineActive: { value: number; delta: string };
	offerAcceptance: { value: string | number; delta: string };
}

export interface DashboardData {
	subtitle?: string;
	kpis: DashboardKpis;
	recentRequisitions: Array<{ title: string; department: string; status: string; openDate: string }>;
	recentActivity: string[];
}




