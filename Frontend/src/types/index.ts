export const TalepDurumu = {
  Yeni: 1,
  Atandi:2,
  Islemde: 3,
  Tamamlandi: 4,
  Iptal: 5,
} as const;

export type TalepDurumu = (typeof TalepDurumu)[keyof typeof TalepDurumu];

export const TalepOncelik = {
  Dusuk: 1,
  Orta: 2,
  Yuksek: 3,
  Acil: 4,
} as const;

export type TalepOncelik = (typeof TalepOncelik)[keyof typeof TalepOncelik];

export interface KimlikYanitDto {
  id: string;
  eposta: string;
  rol: string;
  token: string;
}

export interface KullaniciKayitDto {
  eposta: string;
  sifre: string;
}

export interface KullaniciGirisDto {
  eposta: string;
  sifre: string;
}

export interface Talep {
  id: string;
  baslik: string;
  aciklama: string;
  oncelik: TalepOncelik;
  durum: TalepDurumu;
  olusturanKullaniciId: string;
  olusturulmaTarihi: string;
  olusturanKullanici?: { eposta: string };
  atananKullanici?: { eposta: string };
}

export interface TalepOlusturDto {
  baslik: string;
  aciklama: string;
  oncelik: TalepOncelik;
  talepTuru: string;
}

export interface TalepDurumGuncelleDto {
  talepId: string;
  yeniDurum: TalepDurumu;
  aciklama?: string;
}

export interface YorumEkleDto {
  talepId: string;
  yorum: string;
}

export interface DashboardOzetDto {
  toplam: number;
  yeni: number;
  islemdeki: number;
  tamamlanan: number;
  iptal: number;
}