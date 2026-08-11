import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { talepApi } from '../api/talepApi';
import { useAuth } from '../hooks/useAuth';
import { TalepDurumu, TalepOncelik } from '../types';
import type { Talep, TalepOlusturDto } from '../types';

export const TalepListesi: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [talepler, setTalepler] = useState<Talep[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [oncelik, setOncelik] = useState<TalepOncelik>(TalepOncelik.Orta);
  const [modalAcik, setModalAcik] = useState(false);

  const talepleriGetir = async () => {
    try {
      const data = await talepApi.talepleriGetir();
      setTalepler(data);
    } catch (err) {
      console.error('Talepler çekilemedi:', err);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    talepleriGetir();
  }, []);

  const handleTalepOlustur = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto: TalepOlusturDto = {
        baslik,
        aciklama,
        oncelik,
        talepTuru: 'Genel', // Backend'in zorunlu tuttuğu alan eklendi
      };

      await talepApi.talepOlustur(dto);
      setBaslik('');
      setAciklama('');
      setOncelik(TalepOncelik.Orta);
      setModalAcik(false);
      talepleriGetir();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        let detayliHata = '';

        if (data?.errors) {
          detayliHata = Object.entries(data.errors)
            .map(([alan, mesajlar]) => `${alan}: ${(mesajlar as string[]).join(', ')}`)
            .join('\n');
        } else if (typeof data === 'string') {
          detayliHata = data;
        } else if (data?.message) {
          detayliHata = data.message;
        } else {
          detayliHata = JSON.stringify(data);
        }

        alert(`Talep Oluşturulamadı (400):\n\n${detayliHata}`);
      } else {
        alert('Talep oluşturulurken beklenmeyen bir hata oluştu.');
      }
    }
  };

  const durumEtiketiGetir = (durum: TalepDurumu) => {
    switch (durum) {
      case TalepDurumu.Yeni:
        return <span style={{ color: '#d97706', fontWeight: 'bold' }}>Yeni</span>;
      case TalepDurumu.Islemde:
        return <span style={{ color: '#0284c7', fontWeight: 'bold' }}>İşlemde</span>;
      case TalepDurumu.Tamamlandi:
        return <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Tamamlandı</span>;
      case TalepDurumu.Iptal:
        return <span style={{ color: '#dc2626', fontWeight: 'bold' }}>İptal</span>;
      default:
        return <span>Bilinmiyor</span>;
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
          >
            ← Panele Dön
          </button>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Taleplerim</h1>
        </div>
        <button
          onClick={() => setModalAcik(true)}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Yeni Talep Oluştur
        </button>
      </div>

      {yukleniyor ? (
        <p>Talepler yükleniyor...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {talepler.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>Henüz kayıtlı bir talep bulunmuyor.</p>
          ) : (
            talepler.map((talep) => (
              <div
                key={talep.id}
                style={{ backgroundColor: '#1e293b', padding: '1.2rem', borderRadius: '10px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8' }}>{talep.baslik}</h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>{talep.aciklama}</p>
                  <small style={{ color: '#64748b', display: 'block', marginTop: '0.5rem' }}>
                    Oluşturulma: {new Date(talep.olusturulmaTarihi).toLocaleDateString('tr-TR')}
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '0.5rem' }}>Durum: {durumEtiketiGetir(talep.durum)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {modalAcik && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleTalepOlustur} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '400px', color: '#fff' }}>
            <h2 style={{ marginTop: 0, color: '#38bdf8' }}>Yeni Talep Oluştur</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Başlık</label>
              <input
                type="text"
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                required
                placeholder="Talep başlığı"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Açıklama</label>
              <textarea
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                required
                rows={3}
                placeholder="Talep detayları..."
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Öncelik</label>
              <select
                value={oncelik}
                onChange={(e) => setOncelik(Number(e.target.value) as TalepOncelik)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              >
                <option value={TalepOncelik.Dusuk}>Düşük</option>
                <option value={TalepOncelik.Orta}>Orta</option>
                <option value={TalepOncelik.Yuksek}>Yüksek</option>
                <option value={TalepOncelik.Acil}>Acil</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setModalAcik(false)}
                style={{ backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              >
                İptal
              </button>
              <button
                type="submit"
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Oluştur
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};