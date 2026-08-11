import { axiosClient } from './axiosClient';
import type { DashboardOzetDto } from '../types';

export const dashboardApi = {
  ozetGetir: async (): Promise<DashboardOzetDto> => {
    const res = await axiosClient.get<DashboardOzetDto>('/Dashboard/ozet');
    return res.data;
  },
};