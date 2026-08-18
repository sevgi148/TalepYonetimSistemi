import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRequests } from '../hooks/useRequests';
import { RequestDetailModal } from '../components/RequestDetailModal';
import { 
  RequestStatus, 
  RequestPriority, 
  type CreateRequestDto 
} from '../types';

export const RequestList: React.FC = () => {
  const navigate = useNavigate();

  const {
    requests,
    selectedRequest,
    loading,
    actionLoading,
    fetchRequests,
    fetchRequestDetails,
    createRequest,
    updateStatus,
    addComment
  } = useRequests();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<RequestPriority>(RequestPriority.Medium);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto: CreateRequestDto = {
        title: title.trim(),
        description: description.trim(),
        requestType: 'Other',
        priority
      };

      await createRequest(dto);
      
      setTitle('');
      setDescription('');
      setPriority(RequestPriority.Medium);
      setIsCreateModalOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        let detailedError = '';

        if (data?.errors) {
          detailedError = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
        } else if (typeof data === 'string') {
          detailedError = data;
        } else if (data?.message) {
          detailedError = data.message;
        } else {
          detailedError = JSON.stringify(data);
        }

        alert(`Talep oluşturulamadı:\n\n${detailedError}`);
      } else {
        alert('Talep oluşturulurken beklenmeyen bir hata oluştu.');
      }
    }
  };

  const handleRequestClick = async (id: string) => {
    await fetchRequestDetails(id);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async (requestId: string, newStatus: RequestStatus, note?: string) => {
    try {
      await updateStatus({ requestId, newStatus, description: note });
    } catch (err) {
      console.error('Durum güncellenirken hata:', err);
    }
  };

  const handleAddComment = async (requestId: string, content: string) => {
    try {
      await addComment({ requestId, content });
    } catch (err) {
      console.error('Yorum eklenirken hata:', err);
    }
  };

  const getStatusBadge = (status: RequestStatus | number | string | unknown) => {
    const val = typeof status === 'string' ? status.toLowerCase() : status;

    if (val === 1 || val === '1' || val === 'new' || val === 'yeni') {
      return <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Yeni</span>;
    }
    if (val === 2 || val === '2' || val === 'inprogress' || val === 'islemde' || val === 'in progress') {
      return <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>İşlemde</span>;
    }
    if (val === 3 || val === '3' || val === 'assigned' || val === 'atandi') {
      return <span style={{ color: '#c084fc', fontWeight: 'bold' }}>Atandı</span>;
    }
    if (val === 4 || val === '4' || val === 'resolved' || val === 'tamamlandi' || val === 'cozuldu') {
      return <span style={{ color: '#10b981', fontWeight: 'bold' }}>Tamamlandı</span>;
    }
    if (val === 5 || val === '5' || val === 'closed' || val === 'kapatildi' || val === 'iptal' || val === 'iptal edildi') {
      return <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>İptal Edildi</span>;
    }

    return <span style={{ color: '#cbd5e1' }}>Bilinmiyor</span>;
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#ffffff' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
          >
            ← Panele Dön
          </button>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Taleplerim</h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Yeni Talep Oluştur
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Talepler yükleniyor...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>Henüz kayıtlı talep bulunmuyor.</p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                onClick={() => handleRequestClick(request.id)}
                style={{
                  backgroundColor: '#1e293b',
                  padding: '1.2rem',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8' }}>{request.title}</h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>{request.description}</p>
                  <small style={{ color: '#64748b', display: 'block', marginTop: '0.5rem' }}>
                    Oluşturulma: {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '0.5rem' }}>Durum: {getStatusBadge(request.status)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleCreateRequest} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '400px', color: '#fff' }}>
            <h2 style={{ marginTop: 0, color: '#38bdf8' }}>Yeni Talep Oluştur</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Başlık</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Talep başlığı"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Açıklama</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Talep detayları..."
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                style={{ backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: actionLoading ? 0.7 : 1 }}
              >
                {actionLoading ? 'Oluşturuluyor.' : 'Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}

      <RequestDetailModal
        request={selectedRequest}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onAddComment={handleAddComment}
        loading={loading}
      />
    </div>
  );
};