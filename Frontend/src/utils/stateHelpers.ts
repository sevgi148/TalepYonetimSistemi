import { TalepDurumu, TalepOncelik } from '../types';
export const getDurumMetni = (durum: TalepDurumu): string => {
  switch (durum) {
    case TalepDurumu.Yeni:
      return 'Yeni';
    case TalepDurumu.Islemde:
      return 'İşlemde';
    case TalepDurumu.Tamamlandi:
      return 'Tamamlandı';
    case TalepDurumu.Iptal:
      return 'İptal';
    default:
      return 'Bilinmiyor';
  }
};

export const getDurumRenk = (durum: TalepDurumu): { bg: string; text: string } => {
  switch (durum) {
    case TalepDurumu.Yeni:
      return { bg: '#78350f', text: '#fef3c7' }; 
    case TalepDurumu.Islemde:
      return { bg: '#075985', text: '#e0f2fe' }; 
    case TalepDurumu.Tamamlandi:
      return { bg: '#14532d', text: '#dcfce7' }; 
    case TalepDurumu.Iptal:
      return { bg: '#7f1d1d', text: '#fee2e2' }; 
    default:
      return { bg: '#334155', text: '#f1f5f9' };
  }
};

export const getOncelikMetni = (oncelik: TalepOncelik): string => {
  switch (oncelik) {
    case TalepOncelik.Dusuk:
      return 'Düşük';
    case TalepOncelik.Orta:
      return 'Orta';
    case TalepOncelik.Yuksek:
      return 'Yüksek';
    case TalepOncelik.Acil:
      return 'Acil';
    default:
      return 'Belirtilmedi';
  }
};

export const formatTarih = (tarihStr: string): string => {
  if (!tarihStr) return '-';
  const tarih = new Date(tarihStr);
  return tarih.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};