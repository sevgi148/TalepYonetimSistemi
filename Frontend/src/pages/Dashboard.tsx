import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

interface TalepOzeti {
  toplam: number;
  yeni: number;
  islemde: number;
  tamamlanan: number;
  iptal: number;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const kullaniciAdi = localStorage.getItem('kullaniciAdi') || 'Kullanıcı';

  const [ozet, setOzet] = useState<TalepOzeti>({
    toplam: 0,
    yeni: 0,
    islemde: 0,
    tamamlanan: 0,
    iptal: 0,
  });
  const [yukleniyor, setYukleniyor] = useState(true);

  const ozetGetir = async () => {
    try {
      const res = await axiosClient.get<TalepOzeti>('/Talepler/ozet');
      setOzet(res.data);
    } catch (err) {
      console.error('Özet verisi çekilemedi:', err);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    ozetGetir();
  }, []);

  const handleCikis = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullaniciAdi');
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Talep Yönetim Sistemi</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#94a3b8', fontSize: '1rem' }}>👤 {kullaniciAdi}</span>
          <button
            onClick={() => navigate('/talepler')}
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📋 Taleplerime Git
          </button>
          <button
            onClick={handleCikis}
            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {yukleniyor ? (
        <p>İstatistikler yükleniyor...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #2563eb', textAlign: 'center' }}>
              <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>Toplam Talep</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#2563eb' }}>{ozet.toplam}</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #d97706', textAlign: 'center' }}>
              <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>Yeni Talepler</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#d97706' }}>{ozet.yeni}</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #0284c7', textAlign: 'center' }}>
              <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>İşlemdeki Talepler</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#0284c7' }}>{ozet.islemde}</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #16a34a', textAlign: 'center' }}>
              <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>Tamamlananlar</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#16a34a' }}>{ozet.tamamlanan}</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #dc2626', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>İptal Edilenler</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#dc2626' }}>{ozet.iptal}</p>
          </div>
        </>
      )}
    </div>
  );
};