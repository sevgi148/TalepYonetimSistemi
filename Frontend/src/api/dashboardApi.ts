import { axiosClient } from './axiosClient';
import type { DashboardSummaryDto } from '../types';

export const dashboardApi = {
  getSummary: async (userId?: string): Promise<DashboardSummaryDto> => {
    const res = await axiosClient.get<DashboardSummaryDto>('/dashboard/summary', {
      params: userId ? { userId } : {}
    });
    return res.data;
  },
};