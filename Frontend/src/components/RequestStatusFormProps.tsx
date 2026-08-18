import React, { useState } from 'react';
import { RequestStatus } from '../types';

interface RequestStatusFormProps {
  requestId: string;
  currentStatus: RequestStatus;
  onUpdateStatus: (requestId: string, newStatus: RequestStatus, description?: string) => Promise<void>;
  getStatusText: (status: any) => string;
}

export const RequestStatusForm: React.FC<RequestStatusFormProps> = ({
  requestId,
  currentStatus,
  onUpdateStatus,
  getStatusText
}) => {
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus: RequestStatus) => {
    setIsSubmitting(true);
    try {
      await onUpdateStatus(requestId, newStatus, description);
      setSelectedStatus(null);
      setDescription('');
    } catch (err: unknown) {
      console.error('Durum güncellenirken hata:', err);
      const message = err instanceof Error ? err.message : 'Durum güncellenemedi.';
      alert(`Hata: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#cbd5e1' }}>Talep Durumunu Değiştir</h3>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        
        <button
          type="button"
          disabled={isSubmitting || currentStatus === RequestStatus.Assigned}
          onClick={() => setSelectedStatus(RequestStatus.Assigned)}
          style={{
            backgroundColor: '#8b5cf6',
            color: '#fff',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            opacity: currentStatus === RequestStatus.Assigned ? 0.5 : 1
          }}
        >
          Atama Yap
        </button>

        <button
          type="button"
          disabled={isSubmitting || currentStatus === RequestStatus.InProgress}
          onClick={() => setSelectedStatus(RequestStatus.InProgress)}
          style={{
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            opacity: currentStatus === RequestStatus.InProgress ? 0.5 : 1
          }}
        >
          İşleme Al
        </button>

        <button
          type="button"
          disabled={isSubmitting || currentStatus === RequestStatus.Resolved}
          onClick={() => setSelectedStatus(RequestStatus.Resolved)}
          style={{
            backgroundColor: '#16a34a',
            color: '#fff',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            opacity: currentStatus === RequestStatus.Resolved ? 0.5 : 1
          }}
        >
          Tamamla
        </button>

        <button
          type="button"
          disabled={isSubmitting || currentStatus === RequestStatus.Closed}
          onClick={() => setSelectedStatus(RequestStatus.Closed)}
          style={{
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            opacity: currentStatus === RequestStatus.Closed ? 0.5 : 1
          }}
        >
          İptal Et
        </button>
      </div>

      {selectedStatus && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>
            Yeni Durum: <strong style={{ color: '#38bdf8' }}>{getStatusText(selectedStatus)}</strong>
          </p>
          <input
            type="text"
            placeholder="Durum güncelleme notu (opsiyonel)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #334155',
              backgroundColor: '#1e293b',
              color: '#fff',
              fontSize: '0.85rem',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={() => setSelectedStatus(null)}
              style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange(selectedStatus)}
              disabled={isSubmitting}
              style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              {isSubmitting ? 'Kaydediliyor.' : 'Onayla'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};