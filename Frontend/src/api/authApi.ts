import { axiosClient } from './axiosClient';
import type { KimlikYanitDto, KullaniciGirisDto, KullaniciKayitDto } from '../types';

export const authApi = {
  kayitOl: async (dto: KullaniciKayitDto): Promise<KimlikYanitDto> => {
    const res = await axiosClient.post<KimlikYanitDto>('/Kimlik/kayit', dto);
    return res.data;
  },
  girisYap: async (dto: KullaniciGirisDto): Promise<KimlikYanitDto> => {
    const res = await axiosClient.post<KimlikYanitDto>('/Kimlik/giris', dto);
    return res.data;
  },
};