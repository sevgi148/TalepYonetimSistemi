import { useState, useCallback } from 'react';
import axios from 'axios';
import { talepApi } from '../api/talepApi';
import type { Talep, TalepOlusturDto, TalepDurumGuncelleDto, YorumEkleDto } from '../types';

export const useTalepler = () => {
  const [talepler, setTalepler] = useState<Talep[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(false);
  const [hata, setHata] = useState<string | null>(null);

  const fetchKullaniciTalepleri = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      const data = await talepApi.talepleriGetir();
      setTalepler(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setHata(
          typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data as { message?: string })?.message || 'Talepler yüklenirken bir hata oluştu.'
        );
      } else {
        setHata('Beklenmeyen bir hata oluştu.');
      }
    } finally {
      setYukleniyor(false);
    }
  }, []);

  const fetchTumTalepler = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      const data = await talepApi.tumTalepleriGetir();
      setTalepler(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setHata(
          typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data as { message?: string })?.message || 'Talepler yüklenirken bir hata oluştu.'
        );
      } else {
        setHata('Beklenmeyen bir hata oluştu.');
      }
    } finally {
      setYukleniyor(false);
    }
  }, []);

  const talepOlustur = async (dto: TalepOlusturDto): Promise<boolean> => {
    setHata(null);
    try {
      const yeniTalep = await talepApi.talepOlustur(dto);
      setTalepler((prev) => [yeniTalep, ...prev]);
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setHata(
          typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data as { message?: string })?.message || 'Talep oluşturulurken bir hata oluştu.'
        );
      } else {
        setHata('Beklenmeyen bir hata oluştu.');
      }
      return false;
    }
  };

  const durumGuncelle = async (dto: TalepDurumGuncelleDto): Promise<boolean> => {
    setHata(null);
    try {
      await talepApi.durumGuncelle(dto);
      setTalepler((prev) =>
        prev.map((t) => (t.id === dto.talepId ? { ...t, durum: dto.yeniDurum } : t))
      );
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setHata(
          typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data as { message?: string })?.message || 'Durum güncellenirken bir hata oluştu.'
        );
      } else {
        setHata('Beklenmeyen bir hata oluştu.');
      }
      return false;
    }
  };

  const yorumEkle = async (dto: YorumEkleDto): Promise<boolean> => {
    setHata(null);
    try {
      await talepApi.yorumEkle(dto);
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setHata(
          typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data as { message?: string })?.message || 'Yorum eklenirken bir hata oluştu.'
        );
      } else {
        setHata('Beklenmeyen bir hata oluştu.');
      }
      return false;
    }
  };

  return {
    talepler,
    yukleniyor,
    hata,
    fetchKullaniciTalepleri,
    fetchTumTalepler,
    talepOlustur,
    durumGuncelle,
    yorumEkle,
  };
};