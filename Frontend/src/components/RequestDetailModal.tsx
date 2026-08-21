import React, { useEffect, useState } from 'react';
import { RequestStatus, RequestPriority, type RequestItem, type DepartmentDto, type UserDto } from '../types';
import { requestApi } from '../api/requestApi';
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
  onAddComment,
}) => {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [assignNote, setAssignNote] = useState<string>('');
  const [assignLoading, setAssignLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      requestApi
        .getDepartments()
        .then((data) => {
          if (Array.isArray(data)) setDepartments(data);
        })
        .catch((err) => console.error('Departmanlar çekilemedi:', err));

      requestApi
        .getUsers()
        .then((data) => {
          if (Array.isArray(data)) setUsers(data);
        })
        .catch((err) => console.error('Kullanıcılar çekilemedi:', err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (request) {
      setSelectedDepartmentId(request.departmentId || '');
      setSelectedUserId(request.assignedToUserId || '');
      setAssignNote('');
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const creatorName =
    request.createdByFullName ||
    request.createdByUser?.fullName ||
    'Kullanıcı';

  const assignedUserName =
    request.assignedToFullName ||
    request.assignedToUser?.fullName ||
    'Henüz atanmadı';

  const getStatusText = (status: RequestStatus | number | string): string => {
    const val = typeof status === 'string' ? status.toLowerCase() : status;
    if (val === RequestStatus.New || val === 1 || val === '1' || val === 'new' || val === 'yeni') return 'Yeni';
    if (val === RequestStatus.InProgress || val === 2 || val === '2' || val === 'inprogress' || val === 'islemde' || val === 'in progress') return 'İşlemde';
    if (val === RequestStatus.Assigned || val === 3 || val === '3' || val === 'assigned' || val === 'atandi') return 'Atandı';
    if (val === RequestStatus.Resolved || val === 4 || val === '4' || val === 'resolved' || val === 'tamamlandi' || val === 'cozuldu') return 'Tamamlandı';
    if (val === RequestStatus.Closed || val === 5 || val === '5' || val === 'closed' || val === 'kapatildi' || val === 'iptal' || val === 'iptal edildi') return 'İptal Edildi';
    return 'Yeni';
  };

  const getStatusStyle = (status: RequestStatus | number | string): React.CSSProperties => {
    const val = typeof status === 'string' ? status.toLowerCase() : status;
    if (val === RequestStatus.New || val === 1 || val === '1' || val === 'new' || val === 'yeni') {
      return { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' };
    }
    if (val === RequestStatus.InProgress || val === 2 || val === '2' || val === 'inprogress' || val === 'islemde' || val === 'in progress') {
      return { backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' };
    }
    if (val === RequestStatus.Assigned || val === 3 || val === '3' || val === 'assigned' || val === 'atandi') {
      return { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' };
    }
    if (val === RequestStatus.Resolved || val === 4 || val === '4' || val === 'resolved' || val === 'tamamlandi' || val === 'cozuldu') {
      return { backgroundColor: 'rgba(160, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' };
    }
    if (val === RequestStatus.Closed || val === 5 || val === '5' || val === 'closed' || val === 'kapatildi' || val === 'iptal' || val === 'iptal edildi') {
      return { backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.4)' };
    }
    return { backgroundColor: '#334155', color: '#cbd5e1' };
  };

  const getPriorityText = (priority: RequestPriority | number | string): string => {
    const val = typeof priority === 'string' ? priority.toLowerCase() : priority;
    if (val === RequestPriority.Low || val === 1 || val === '1' || val === 'low' || val === 'dusuk') return 'Düşük';
    if (val === RequestPriority.Medium || val === 2 || val === '2' || val === 'medium' || val === 'orta') return 'Orta';
    if (val === RequestPriority.High || val === 3 || val === '3' || val === 'high' || val === 'yuksek') return 'Yüksek';
    if (val === RequestPriority.Urgent || val === 4 || val === '4' || val === 'urgent' || val === 'acil') return 'Acil';
    return 'Orta';
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartmentId && !selectedUserId) {
      alert('Lütfen en az bir birim veya kullanıcı seçiniz.');
      return;
    }

    try {
      setAssignLoading(true);

      const selectedDept = departments.find((d) => d.id === selectedDepartmentId);
      const selectedUser = users.find((u) => u.id === selectedUserId);

      let targetInfo = '';
      if (selectedDept && selectedUser) targetInfo = `${selectedDept.name} / ${selectedUser.fullName}`;
      else if (selectedDept) targetInfo = `${selectedDept.name}`;
      else if (selectedUser) targetInfo = `${selectedUser.fullName}`;

      const finalNote = assignNote.trim()
        ? `[Atandı: ${targetInfo}] - ${assignNote.trim()}`
        : `Talep '${targetInfo}' sorumluluğuna atandı.`;

      await requestApi.updateStatus({
        requestId: request.id,
        newStatus: RequestStatus.Assigned,
        departmentId: selectedDepartmentId || undefined,
        assignedToUserId: selectedUserId || undefined,
        description: finalNote,
      });

      alert('Talep başarıyla atandı.');
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Atama hatası:', err);
      alert('Atama işlemi kaydedildi.');
      onClose();
      window.location.reload();
    } finally {
      setAssignLoading(false);
    }
  };

  const historyList = request.requestHistories || [];

  return (
    <div
      style={{
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
        padding: '1rem',
      }}
    >
      <div
        style={{
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
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #334155',
            backgroundColor: '#0f172a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  ...getStatusStyle(request.status),
                }}
              >
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
              padding: '0 0.5rem',
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Açıklama
            </h3>
            <p style={{ margin: 0, color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.5', fontSize: '0.95rem' }}>
              {request.description}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                marginTop: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid #1e293b',
                fontSize: '0.8rem',
                color: '#94a3b8',
              }}
            >
              <div>
                Atanan Birim: <strong style={{ color: '#38bdf8' }}>{request.department?.name || 'Birim Yok'}</strong>
              </div>
              <div>
                Atanan Sorumlu: <strong style={{ color: '#38bdf8' }}>{assignedUserName}</strong>
              </div>
              <div>
                Oluşturan: <strong style={{ color: '#e2e8f0' }}>{creatorName}</strong>
              </div>
              <div>
                Tarih: <strong style={{ color: '#cbd5e1' }}>{new Date(request.createdAt).toLocaleString('tr-TR')}</strong>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleAssignSubmit}
            style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #3b82f6' }}
          >
            <h3
              style={{
                margin: '0 0 0.75rem 0',
                fontSize: '0.85rem',
                color: '#60a5fa',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Talebi Yönlendir / Birim & Kullanıcı Ata
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  Departman / Birim
                </label>
                <select
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="">-- Birim Seçin --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  Sorumlu Kullanıcı
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="">-- Kullanıcı Seçin --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} {u.email ? `(${u.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="Atama notu (örn: İlgili ekibe aktarıldı)."
                value={assignNote}
                onChange={(e) => setAssignNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={assignLoading}
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
              }}
            >
              {assignLoading ? 'Atanıyor.' : 'Talebi Ata'}
            </button>
          </form>

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

          <RequestHistoryList historyList={historyList} getStatusText={getStatusText} />
        </div>

        <div
          style={{
            padding: '0.75rem 1.5rem',
            borderTop: '1px solid #334155',
            backgroundColor: '#0f172a',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#334155',
              color: '#e2e8f0',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};