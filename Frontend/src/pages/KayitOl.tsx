import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

export const KayitOl: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');

  const handleKayit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    try {
      const yanit = await authApi.kayitOl({ eposta, sifre });
      login(yanit);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Kayıt hatası detayları:', err.response);

        if (err.response && err.response.data) {
          const backendMesaji =
            typeof err.response.data === 'string'
              ? err.response.data
              : (err.response.data as { message?: string }).message || 'Kayıt işlemi başarısız.';
          setHata(backendMesaji);
        } else {
          setHata('Sunucuya ulaşılamıyor, lütfen backend servisinin çalıştığından emin olun.');
        }
      } else {
        setHata('Beklenmeyen bir hata oluştu.');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
      }}
    >
      <form
        onSubmit={handleKayit}
        style={{
          backgroundColor: '#1e293b',
          padding: '2.5rem',
          borderRadius: '12px',
          width: '380px',
          color: '#fff',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#38bdf8' }}>
          Kayıt Ol
        </h2>

        {hata && (
          <div
            style={{
              backgroundColor: '#ef4444',
              color: '#fff',
              padding: '0.8rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'center',
              fontSize: '0.9rem',
            }}
          >
            {hata}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
            E-Posta
          </label>
          <input
            type="email"
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
            required
            placeholder="E-postanızı giriniz"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#fff',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
            Şifre
          </label>
          <input
            type="password"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            required
            placeholder="Şifreniz"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#fff',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.8rem',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Kayıt Ol
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
          Zaten hesabınız var mı?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Giriş Yap
          </span>
        </p>
      </form>
    </div>
  );
};