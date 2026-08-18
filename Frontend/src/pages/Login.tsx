import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Lütfen e-posta adresinizi ve şifrenizi girin.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Lütfen geçerli bir e-posta adresi girin ('@' işareti içermelidir).");
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await authApi.login({ email: email.trim(), password });
      login(response);
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Giriş hatası detayları:', err.response);

        if (err.response && err.response.data) {
          let backendMessage =
            typeof err.response.data === 'string'
              ? err.response.data
              : (err.response.data as { message?: string }).message || 'Giriş yapılamadı.';
          
          if (backendMessage.toLowerCase().includes('invalid email or password')) {
            backendMessage = 'E-posta adresi veya şifre hatalı.';
          }

          setError(backendMessage);
        } else {
          setError('Sunucuya bağlanılamadı. Lütfen backend servisinin çalıştığından emin olun.');
        }
      } else {
        setError('Beklenmeyen bir hata oluştu.');
      }
    } finally {
      setIsSubmitting(false);
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
        onSubmit={handleLogin}
        noValidate
        style={{
          backgroundColor: '#1e293b',
          padding: '2.5rem',
          borderRadius: '12px',
          width: '380px',
          color: '#fff',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#38bdf8' }}>
          Giriş Yap
        </h2>

        {error && (
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
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="E-posta adresinizi girin"
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
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            placeholder="Şifrenizi girin"
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
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.8rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Giriş yapılıyor.' : 'Giriş Yap'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
          Hesabınız yok mu?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Kayıt Ol
          </span>
        </p>
      </form>
    </div>
  );
};