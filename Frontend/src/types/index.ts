export const TalepTuru = {
  Donanim: 0,
  Yazilim: 1,
  AgArayuzu: 2,
  Diger: 3,
} as const;
export type TalepTuru = typeof TalepTuru[keyof typeof TalepTuru];

export const Oncelik = {
  Dusuk: 0,
  Orta: 1,
  Yuksek: 2,
  Acil: 3,
} as const;
export type Oncelik = typeof Oncelik[keyof typeof Oncelik];

export const TalepDurumu = {
  Yeni: 0,
  Atandi: 1,
  Islemde: 2,
  Tamamlandi: 3,
  Iptal: 4,
} as const;
export type TalepDurumu = typeof TalepDurumu[keyof typeof TalepDurumu];

export interface Kullanici {
  id: number;
  ad: string;
  soyad: string;
  eposta: string;
  rol: string;
}

export interface KimlikYanitDto {
  token: string;
  eposta: string;
  kullaniciAdi: string;
  rol: string;
}

export interface Talep {
  id: number;
  baslik: string;
  aciklama: string;
  talepTuru: TalepTuru;
  oncelik: Oncelik;
  durum: TalepDurumu;
  olusturmaTarihi: string;
  olusturanKullaniciId: number;
  atananKullaniciId?: number;
}

export interface TalepOlusturDto {
  baslik: string;
  aciklama: string;
  talepTuru: TalepTuru;
  oncelik: Oncelik;
  olusturanKullaniciId: number;
}

export interface DashboardOzetDto {
  toplamTalepSayisi: number;
  yeniTalepSayisi: number;
  islemdekiTalepSayisi: number;
  tamamlananTalepSayisi: number;
  iptalTalepSayisi: number;
}