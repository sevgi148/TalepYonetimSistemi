import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export const KayitOl: React.FC = () => {
  const navigate = useNavigate();
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [rol, setRol] = useState('');
  const [birim, setBirim] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    setHata('');

    try {
      await axiosClient.post('/Kimlik/kayit', {
        kullaniciAdi: kullaniciAdi,
        eposta: eposta,
        sifre: sifre,
        rol: rol,
        birim: birim
      });

      alert('Kayıt başarıyla oluşturuldu! Giriş ekranına yönlendiriliyorsunuz.');
      navigate('/login');
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      const mesaj = err.response?.data || 'Kayıt olunurken bir hata oluştu.';
      setHata(typeof mesaj === 'string' ? mesaj : JSON.stringify(mesaj));
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff' }}>
      <form onSubmit={handleRegister} style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '12px', width: '360px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', marginTop: 0, marginBottom: '1.5rem', color: '#38bdf8' }}>Kayıt Ol</h2>

        {hata && (
          <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {hata}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Kullanıcı Adı</label>
          <input
            type="text"
            value={kullaniciAdi}
            onChange={(e) => setKullaniciAdi(e.target.value)}
            required
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>E-Posta</label>
          <input
            type="email"
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
            required
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Şifre</label>
          <input
            type="password"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            required
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Rol</label>
          <input
            type="text"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
            placeholder="Rol giriniz..."
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>Birim</label>
          <input
            type="text"
            value={birim}
            onChange={(e) => setBirim(e.target.value)}
            required
            placeholder="Birim giriniz..."
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={yukleniyor}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {yukleniyor ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          Zaten hesabınız var mı?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>
            Giriş Yap
          </span>
        </p>
      </form>
    </div>
  );
};