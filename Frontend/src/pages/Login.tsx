import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');

  const handleGiris = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    try {
      const res = await axiosClient.post('/Kimlik/giris', {
        Eposta: eposta,
        Sifre: sifre,
      });

      const token = res.data.token || res.data.Token;
      const kullaniciAdi = res.data.kullaniciAdi || res.data.KullaniciAdi;

      localStorage.setItem('token', token);
      localStorage.setItem('kullaniciAdi', kullaniciAdi);

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Giriş hatası detayları:', err.response);

      if (err.response && err.response.data) {
        const backendMesaji = typeof err.response.data === 'string'
          ? err.response.data
          : (err.response.data.message || 'Giriş işlemi başarısız.');
        setHata(backendMesaji);
      } else {
        setHata('Sunucuya ulaşılamıyor, lütfen backend servisinin çalıştığından emin olun.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <form onSubmit={handleGiris} style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '12px', width: '380px', color: '#fff' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#38bdf8' }}>Giriş Yap</h2>

        {hata && (
          <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {hata}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>E-Posta</label>
          <input
            type="email"
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
            required
            placeholder="E-postanızı giriniz"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Şifre</label>
          <input
            type="password"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            required
            placeholder="Şifreniz"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '0.8rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Giriş Yap
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
          Hesabınız yok mu?{' '}
          <span onClick={() => navigate('/kayit-ol')} style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>
            Kayıt Ol
          </span>
        </p>
      </form>
    </div>
  );
};