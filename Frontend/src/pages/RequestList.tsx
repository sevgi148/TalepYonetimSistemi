import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRequests } from '../hooks/useRequests';
import { RequestDetailModal } from '../components/RequestDetailModal';
import { 
  RequestStatus, 
  RequestPriority, 
  RequestType,
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
  const [type, setType] = useState<RequestType>(RequestType.Software);
  const [priority, setPriority] = useState<RequestPriority>(RequestPriority.Medium);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const normalizeStatus = (status: any): string => {
    const val = typeof status === 'string' ? status.toLowerCase() : status;
    if (val === 1 || val === '1' || val === 'new' || val === 'yeni') return '1';
    if (val === 2 || val === '2' || val === 'inprogress' || val === 'islemde' || val === 'in progress') return '2';
    if (val === 3 || val === '3' || val === 'assigned' || val === 'atandi') return '3';
    if (val === 4 || val === '4' || val === 'resolved' || val === 'tamamlandi' || val === 'cozuldu') return '4';
    if (val === 5 || val === '5' || val === 'closed' || val === 'kapatildi' || val === 'iptal' || val === 'iptal edildi') return '5';
    return '1';
  };

  const normalizePriority = (priorityVal: any): string => {
    const val = typeof priorityVal === 'string' ? priorityVal.toLowerCase() : priorityVal;
    if (val === 1 || val === '1' || val === 'low' || val === 'dusuk') return '1';
    if (val === 2 || val === '2' || val === 'medium' || val === 'orta') return '2';
    if (val === 3 || val === '3' || val === 'high' || val === 'yuksek') return '3';
    if (val === 4 || val === '4' || val === 'urgent' || val === 'acil') return '4';
    return '2';
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch = 
        (req.title || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (req.description || '').toLowerCase().includes(searchTerm.toLowerCase().trim());

      const reqStatusId = normalizeStatus(req.status);
      const matchesStatus = statusFilter === 'all' || reqStatusId === statusFilter;

      const reqPriorityId = normalizePriority(req.priority);
      const matchesPriority = priorityFilter === 'all' || reqPriorityId === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, searchTerm, statusFilter, priorityFilter]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dto: CreateRequestDto = {
        title: title.trim(),
        description: description.trim(),
        type: Number(type) as RequestType,
        priority: Number(priority) as RequestPriority
      };

      await createRequest(dto);
      
      setTitle('');
      setDescription('');
      setType(RequestType.Software);
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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
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

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: '#1e293b',
        padding: '1rem',
        borderRadius: '10px',
        border: '1px solid #334155',
        marginBottom: '1.5rem'
      }}>
        <input
          type="text"
          placeholder="Başlık veya açıklamada ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '2',
            minWidth: '220px',
            padding: '0.6rem 0.8rem',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#fff',
            outline: 'none'
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            flex: '1',
            minWidth: '150px',
            padding: '0.6rem 0.8rem',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#fff',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">Tüm Durumlar</option>
          <option value="1">Yeni</option>
          <option value="2">İşlemde</option>
          <option value="3">Atandı</option>
          <option value="4">Tamamlandı</option>
          <option value="5">İptal Edildi</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{
            flex: '1',
            minWidth: '150px',
            padding: '0.6rem 0.8rem',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#fff',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">Tüm Öncelikler</option>
          <option value="1">Düşük</option>
          <option value="2">Orta</option>
          <option value="3">Yüksek</option>
          <option value="4">Acil</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Talepler yükleniyor...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredRequests.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', margin: '2rem 0' }}>
              {requests.length === 0 ? 'Henüz kayıtlı talep bulunmuyor.' : 'Arama kriterlerine uygun talep bulunamadı.'}
            </p>
          ) : (
            filteredRequests.map((request) => (
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
          <form onSubmit={handleCreateRequest} style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '420px', color: '#fff' }}>
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Talep Türü</label>
              <select
                value={type}
                onChange={(e) => setType(Number(e.target.value) as RequestType)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              >
                <option value={RequestType.Software}>Yazılım Destek</option>
                <option value={RequestType.Hardware}>Donanım & Sistem</option>
                <option value={RequestType.Network}>Ağ & Güvenlik</option>
                <option value={RequestType.Access}>Erişim & Yetki</option>
                <option value={RequestType.Administrative}>İdari İşler</option>
                <option value={RequestType.HR}>İnsan Kaynakları</option>
                <option value={RequestType.Other}>Diğer</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Öncelik</label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value) as RequestPriority)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              >
                <option value={RequestPriority.Low}>Düşük</option>
                <option value={RequestPriority.Medium}>Orta</option>
                <option value={RequestPriority.High}>Yüksek</option>
                <option value={RequestPriority.Urgent}>Acil</option>
              </select>
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
                {actionLoading ? 'Oluşturuluyor...' : 'Oluştur'}
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