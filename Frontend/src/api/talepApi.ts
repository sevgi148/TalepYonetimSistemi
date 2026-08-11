import { axiosClient } from './axiosClient';
import type { Talep, TalepOlusturDto, TalepDurumGuncelleDto, YorumEkleDto } from '../types';

export const talepApi = {
  talepleriGetir: async (): Promise<Talep[]> => {
    const res = await axiosClient.get<Talep[]>('/Talepler');
    return res.data;
  },
  tumTalepleriGetir: async (): Promise<Talep[]> => {
    const res = await axiosClient.get<Talep[]>('/Talepler/tum-talepler');
    return res.data;
  },
  talepGetirById: async (id: string): Promise<Talep> => {
    const res = await axiosClient.get<Talep>(`/Talepler/${id}`);
    return res.data;
  },
  talepOlustur: async (dto: TalepOlusturDto): Promise<Talep> => {
    const res = await axiosClient.post<Talep>('/Talepler', dto);
    return res.data;
  },
  durumGuncelle: async (dto: TalepDurumGuncelleDto): Promise<{ mesaj: string }> => {
    const res = await axiosClient.put<{ mesaj: string }>('/Talepler/durum', dto);
    return res.data;
  },
  yorumEkle: async (dto: YorumEkleDto): Promise<{ mesaj: string }> => {
    const res = await axiosClient.post<{ mesaj: string }>('/Talepler/yorum', dto);
    return res.data;
  },
};