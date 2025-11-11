import { getJson } from './apiClient';
import type { DashboardData } from '../types/dashboard';
import type { JobLevelOption, RequisitionEnums } from '../types/requisitions';

export async function fetchDashboardData(): Promise<DashboardData> {
	return await getJson<DashboardData>('/src/mocks/dashboard.json');
}

export async function fetchJobLevels(): Promise<JobLevelOption[]> {
	const data = await getJson<{ jobLevels: JobLevelOption[] }>('/src/mocks/requisitions.json');
	return data.jobLevels;
}

export async function fetchRequisitionEnums(): Promise<RequisitionEnums> {
	const data = await getJson<{
		jobTypes: string[];
		priorities: string[];
		positionTypes: string[];
	}>('/src/mocks/requisitions.json');
	return {
		jobTypes: data.jobTypes || [],
		priorities: data.priorities || [],
		positionTypes: data.positionTypes || []
	};
}




