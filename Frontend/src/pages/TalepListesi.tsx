import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

interface Talep {
  id: number;
  baslik: string;
  aciklama: string;
  talepTuru: string;
  oncelik: string;
  durum: number | string;
  olusturulmaTarihi: string;
}

export const TalepListesi: React.FC = () => {
  const navigate = useNavigate();
  const [talepler, setTalepler] = useState<Talep[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  const [aramaMetni, setAramaMetni] = useState('');
  const [seciliDurum, setSeciliDurum] = useState<string>('hepsi');

  const talepleriGetir = async () => {
    try {
      const res = await axiosClient.get('/Talepler');
      setTalepler(res.data);
    } catch (err) {
      console.error('Talepler çekilemedi:', err);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    talepleriGetir();
  }, []);

  const filtrelenmisTalepler = talepler.filter((t) => {
    const baslikEslestimi = t.baslik.toLowerCase().includes(aramaMetni.toLowerCase());
    const durumEslestimi = seciliDurum === 'hepsi' || t.durum.toString() === seciliDurum;
    return baslikEslestimi && durumEslestimi;
  });

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#334155',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Dashboard'a Dön
          </button>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Taleplerim</h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Başlığa göre ara..."
          value={aramaMetni}
          onChange={(e) => setAramaMetni(e.target.value)}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1px solid #334155',
            backgroundColor: '#1e293b',
            color: '#fff',
            outline: 'none'
          }}
        />
        <select
          value={seciliDurum}
          onChange={(e) => setSeciliDurum(e.target.value)}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1px solid #334155',
            backgroundColor: '#1e293b',
            color: '#fff',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="hepsi">Tüm Durumlar</option>
          <option value="0">Yeni</option>
          <option value="1">İşlemde</option>
          <option value="2">Tamamlandı</option>
          <option value="3">İptal</option>
        </select>
      </div>

      {yukleniyor ? (
        <p>Talepler yükleniyor...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#334155', textAlign: 'left', color: '#94a3b8' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Başlık</th>
                <th style={{ padding: '1rem' }}>Tür</th>
                <th style={{ padding: '1rem' }}>Öncelik</th>
                <th style={{ padding: '1rem' }}>Durum</th>
                <th style={{ padding: '1rem' }}>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisTalepler.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    Aranan kriterlere uygun talep bulunamadı.
                  </td>
                </tr>
              ) : (
                filtrelenmisTalepler.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '1rem' }}>#{item.id}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{item.baslik}</td>
                    <td style={{ padding: '1rem' }}>{item.talepTuru}</td>
                    <td style={{ padding: '1rem' }}>{item.oncelik}</td>
                    <td style={{ padding: '1rem' }}>{item.durum}</td>
                    <td style={{ padding: '1rem' }}>{new Date(item.olusturulmaTarihi).toLocaleDateString('tr-TR')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};