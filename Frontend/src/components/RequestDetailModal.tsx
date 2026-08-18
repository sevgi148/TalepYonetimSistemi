import React from 'react';
import { type RequestItem, RequestStatus, RequestPriority } from '../types';
import { RequestStatusForm } from './RequestStatusFormProps';
import { RequestCommentSection } from './RequestCommentSection';
import { RequestHistoryList } from './RequestHistoryList';

interface RequestDetailModalProps {
  request: RequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (requestId: string, newStatus: RequestStatus, description?: string) => Promise<void>;
  onAddComment: (requestId: string, content: string) => Promise<void>;
  loading?: boolean;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddComment
}) => {
  if (!isOpen || !request) return null;

  const creatorName = 
    request.createdByFullName || 
    request.createdByUser?.fullName || 
    'Kullanıcı';

  const getStatusText = (status: any): string => {
    const val = typeof status === 'string' ? status.toLowerCase() : status;

    if (val === 1 || val === '1' || val === 'new' || val === 'yeni') return 'Yeni';
    if (val === 2 || val === '2' || val === 'inprogress' || val === 'islemde' || val === 'in progress') return 'İşlemde';
    if (val === 3 || val === '3' || val === 'assigned' || val === 'atandi') return 'Atandı';
    if (val === 4 || val === '4' || val === 'resolved' || val === 'tamamlandi' || val === 'cozuldu') return 'Tamamlandı';
    if (val === 5 || val === '5' || val === 'closed' || val === 'kapatildi' || val === 'iptal' || val === 'iptal edildi') return 'İptal Edildi';

    return 'Yeni';
  };

  const getStatusStyle = (status: any) => {
    const val = typeof status === 'string' ? status.toLowerCase() : status;

    if (val === 1 || val === '1' || val === 'new' || val === 'yeni') {
      return { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' };
    }
    if (val === 2 || val === '2' || val === 'inprogress' || val === 'islemde' || val === 'in progress') {
      return { backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' };
    }
    if (val === 3 || val === '3' || val === 'assigned' || val === 'atandi') {
      return { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' };
    }
    if (val === 4 || val === '4' || val === 'resolved' || val === 'tamamlandi' || val === 'cozuldu') {
      return { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' };
    }
    if (val === 5 || val === '5' || val === 'closed' || val === 'kapatildi' || val === 'iptal' || val === 'iptal edildi') {
      return { backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.4)' };
    }

    return { backgroundColor: '#334155', color: '#cbd5e1' };
  };

  const getPriorityText = (priority: any): string => {
    const val = typeof priority === 'string' ? priority.toLowerCase() : priority;

    if (val === 1 || val === '1' || val === 'low' || val === 'dusuk') return 'Düşük';
    if (val === 2 || val === '2' || val === 'medium' || val === 'orta') return 'Orta';
    if (val === 3 || val === '3' || val === 'high' || val === 'yuksek') return 'Yüksek';
    if (val === 4 || val === '4' || val === 'urgent' || val === 'acil') return 'Acil';

    return 'Orta';
  };

  const historyList = request.requestHistories || [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        color: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #334155',
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #334155',
          backgroundColor: '#0f172a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                ...getStatusStyle(request.status)
              }}>
                {getStatusText(request.status)}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Öncelik: <strong style={{ color: '#e2e8f0' }}>{getPriorityText(request.priority)}</strong>
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#38bdf8' }}>{request.title}</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.75rem',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 0.5rem'
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Açıklama</h3>
            <p style={{ margin: 0, color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.5', fontSize: '0.95rem' }}>
              {request.description}
            </p>
            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span>Oluşturan: <strong style={{ color: '#38bdf8' }}>{creatorName}</strong></span>
              <span>Tarih: <strong style={{ color: '#cbd5e1' }}>{new Date(request.createdAt).toLocaleString('tr-TR')}</strong></span>
            </div>
          </div>

          <RequestStatusForm
            requestId={request.id}
            currentStatus={request.status}
            onUpdateStatus={onUpdateStatus}
            getStatusText={getStatusText}
          />

          <RequestCommentSection
            requestId={request.id}
            comments={request.comments}
            onAddComment={onAddComment}
          />

          <RequestHistoryList
            historyList={historyList}
            getStatusText={getStatusText}
          />

        </div>

        <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #334155', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ backgroundColor: '#334155', color: '#e2e8f0', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};