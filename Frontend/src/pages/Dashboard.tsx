import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { useAuth } from '../hooks/useAuth';
import type { DashboardSummaryDto } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userDisplayName = user?.fullName || user?.email || 'Kullanıcı';

  const [summary, setSummary] = useState<DashboardSummaryDto>({
    totalRequests: 0,
    newRequests: 0,
    assignedRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    cancelledRequests: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);

  const fetchSummary = async () => {
    try {
      const data = await dashboardApi.getSummary();
      if (data) {
        setSummary(data);
      }
    } catch (err) {
      console.error('Özet verisi alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#ffffff' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Talep Yönetim Sistemi</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: '600' }}>
            {userDisplayName}
          </span>
          <button
            onClick={() => navigate('/requests')}
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Taleplerim
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>İstatistikler yükleniyor.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #2563eb', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>Toplam Talep</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#2563eb' }}>
              {summary.totalRequests ?? 0}
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #d97706', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>Yeni Talepler</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#d97706' }}>
              {summary.newRequests ?? 0}
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #8b5cf6', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>Atanan Talepler</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#8b5cf6' }}>
              {summary.assignedRequests ?? 0}
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #0284c7', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>İşlemdeki Talepler</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#0284c7' }}>
              {summary.inProgressRequests ?? 0}
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #16a34a', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>Tamamlanan Talepler</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#16a34a' }}>
              {summary.completedRequests ?? 0}
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '6px solid #dc2626', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>İptal Edilen İşlemler</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#dc2626' }}>
              {summary.cancelledRequests ?? 0}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};