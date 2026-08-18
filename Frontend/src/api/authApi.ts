import { axiosClient } from './axiosClient';
import type { IdentityResponseDto, UserLoginDto, UserRegisterDto } from '../types';

export const authApi = {
  register: async (dto: UserRegisterDto): Promise<IdentityResponseDto> => {
    const res = await axiosClient.post<IdentityResponseDto>('/auth/register', dto);
    return res.data;
  },

  login: async (dto: UserLoginDto): Promise<IdentityResponseDto> => {
    const res = await axiosClient.post<IdentityResponseDto>('/auth/login', dto);
    return res.data;
  },
};