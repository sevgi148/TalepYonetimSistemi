import { axiosClient } from './axiosClient';
import type { 
  RequestItem, 
  CreateRequestDto, 
  UpdateRequestStatusDto, 
  AddCommentDto,
  DepartmentDto,
  UserDto
} from '../types';

export const requestApi = {
  getUserRequests: async (): Promise<RequestItem[]> => {
    const res = await axiosClient.get<RequestItem[]>('/requests');
    return res.data;
  },

  getAll: async (): Promise<RequestItem[]> => {
    const res = await axiosClient.get<RequestItem[]>('/requests/all');
    return res.data;
  },

  getById: async (id: string): Promise<RequestItem> => {
    const res = await axiosClient.get<RequestItem>(`/requests/${id}`);
    return res.data;
  },

  create: async (dto: CreateRequestDto): Promise<RequestItem> => {
    const res = await axiosClient.post<RequestItem>('/requests', dto);
    return res.data;
  },

  updateStatus: async (dto: UpdateRequestStatusDto): Promise<void> => {
    await axiosClient.put('/requests/status', dto);
  },

  addComment: async (dto: AddCommentDto): Promise<void> => {
    await axiosClient.post('/requests/comment', dto);
  },

  getDepartments: async (): Promise<DepartmentDto[]> => {
    const res = await axiosClient.get<DepartmentDto[]>('/departments');
    return res.data;
  },

  getUsers: async (): Promise<UserDto[]> => {
    const res = await axiosClient.get<UserDto[]>('/users');
    return res.data;
  },
};