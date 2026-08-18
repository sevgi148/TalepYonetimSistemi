import { axiosClient } from './axiosClient';
import type { DashboardSummaryDto } from '../types';

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummaryDto> => {
    const res = await axiosClient.get<DashboardSummaryDto>('/dashboard/summary');
    return res.data;
  },
};