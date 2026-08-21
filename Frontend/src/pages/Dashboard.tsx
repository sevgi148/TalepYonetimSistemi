import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    openRequests: 0,
    assignedToUserRequests: 0,
    requestsByType: {},
  });

  const [loading, setLoading] = useState<boolean>(true);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await dashboardApi.getSummary(user?.id);
      if (data) {
        setSummary(data);
      }
    } catch (err) {
      console.error('Özet verisi alınamadı:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const total = summary.totalRequests || 0;

  const stats = [
    { label: 'Yeni', count: summary.newRequests || 0, color: '#f59e0b' },
    { label: 'Atandı', count: summary.assignedRequests || 0, color: '#a855f7' },
    { label: 'İşlemde', count: summary.inProgressRequests || 0, color: '#38bdf8' },
    { label: 'Tamamlandı', count: summary.completedRequests || 0, color: '#10b981' },
    { label: 'İptal Edildi', count: summary.cancelledRequests || 0, color: '#ef4444' },
  ];

  const pieGradient = useMemo(() => {
    if (total === 0) return 'conic-gradient(#334155 0deg 360deg)';

    let accumulatedDegrees = 0;
    const slices = stats
      .filter((s) => s.count > 0)
      .map((s) => {
        const sliceDeg = (s.count / total) * 360;
        const start = accumulatedDegrees;
        const end = accumulatedDegrees + sliceDeg;
        accumulatedDegrees = end;
        return `${s.color} ${start}deg ${end}deg`;
      });

    return `conic-gradient(${slices.join(', ')})`;
  }, [stats, total]);

  const getTypeName = (key: string): string => {
    const k = key.toLowerCase();
    if (k === '0' || k === 'none' || k === 'belirtilmemis') return 'Belirtilmemiş / Genel';
    if (k === '1' || k === 'software' || k === 'yazilim') return 'Yazılım Destek';
    if (k === '2' || k === 'hardware' || k === 'donanim') return 'Donanım & Sistem';
    if (k === '3' || k === 'network' || k === 'ag') return 'Ağ & Güvenlik';
    if (k === '4' || k === 'access' || k === 'erisim') return 'Erişim & Yetki';
    if (k === '5' || k === 'administrative' || k === 'idari') return 'İdari İşler';
    if (k === '6' || k === 'hr' || k === 'insankaynaklari') return 'İnsan Kaynakları';
    if (k === '7' || k === 'other' || k === 'diger') return 'Diğer';
    return key;
  };

  return (
    <div style={{ backgroundColor: '#0b1329', minHeight: '100vh', color: '#ffffff', padding: '2rem' }}>
      
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', color: '#f8fafc' }}>
            Talep Yönetim Sistemi
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Hoş geldin, <span style={{ color: '#38bdf8', fontWeight: '600' }}>{userDisplayName}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/requests')}
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
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
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>İstatistikler yükleniyor...</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#131f37',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #1e293b',
                borderLeft: '5px solid #38bdf8',
              }}
            >
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>Toplam Talep</span>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8', marginTop: '0.4rem' }}>
                {total}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#131f37',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #1e293b',
                borderLeft: '5px solid #f59e0b',
              }}
            >
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>
                Açık Talepler
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.4rem' }}>
                {summary.openRequests ?? (summary.newRequests + summary.assignedRequests + summary.inProgressRequests)}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#131f37',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #1e293b',
                borderLeft: '5px solid #10b981',
              }}
            >
              <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>Bana Atanmış İşler</span>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.4rem' }}>
                {summary.assignedToUserRequests || 0}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            {stats.map((s, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#131f37',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  border: '1px solid #1e293b',
                  borderLeft: `4px solid ${s.color}`,
                }}
              >
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{s.label}</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: s.color, marginTop: '0.2rem' }}>
                  {s.count}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            <div
              style={{
                backgroundColor: '#131f37',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #1e293b',
              }}
            >
              <h2 style={{ fontSize: '1.1rem', color: '#f8fafc', marginTop: 0, marginBottom: '1.5rem' }}>
                Talep Durum Dağılımı
              </h2>

              {total === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', margin: '2rem 0' }}>
                  Henüz veri bulunmuyor.
                </p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', gap: '1.5rem' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '180px',
                      height: '180px',
                      borderRadius: '50%',
                      background: pieGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: '#131f37',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Toplam</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f8fafc' }}>
                        {total}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '180px' }}>
                    {stats.map((s, idx) => {
                      const percent = total > 0 ? Math.round((s.count / total) * 100) : 0;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#0f172a',
                            padding: '0.5rem 0.8rem',
                            borderRadius: '6px',
                            border: '1px solid #1e293b',
                            fontSize: '0.85rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color }} />
                            <span style={{ color: '#e2e8f0' }}>{s.label}</span>
                          </div>
                          <span style={{ fontWeight: 'bold', color: s.color }}>
                            {s.count} (%{percent})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: '#131f37',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #1e293b',
              }}
            >
              <h2 style={{ fontSize: '1.1rem', color: '#f8fafc', marginTop: 0, marginBottom: '1.5rem' }}>
                Talep Türüne Göre Dağılım
              </h2>

              {summary.requestsByType && Object.keys(summary.requestsByType).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(summary.requestsByType).map(([typeKey, count]) => {
                    const typePercent = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div
                        key={typeKey}
                        style={{
                          backgroundColor: '#0f172a',
                          padding: '0.85rem 1rem',
                          borderRadius: '8px',
                          border: '1px solid #1e293b',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '0.9rem' }}>
                            {getTypeName(typeKey)}
                          </span>
                          <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {count} adet (%{typePercent})
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${typePercent}%`,
                              height: '100%',
                              backgroundColor: '#38bdf8',
                              borderRadius: '3px',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#64748b', textAlign: 'center', margin: '2rem 0' }}>
                  Henüz kategori bazlı talep verisi bulunmuyor.
                </p>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};