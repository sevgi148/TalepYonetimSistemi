import React from 'react';
import type { RequestHistory } from '../types';

interface RequestHistoryListProps {
  historyList: RequestHistory[];
  getStatusText: (status: number) => string;
}

export const RequestHistoryList: React.FC<RequestHistoryListProps> = ({
  historyList,
  getStatusText
}) => {
  return (
    <div>
      <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#cbd5e1' }}>Talep Geçmişi</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '140px', overflowY: 'auto' }}>
        {historyList && historyList.length > 0 ? (
          historyList.map((log) => {
            const actorName = 
              log.userName || 
              log.user?.fullName || 
              'Sistem';

            const date = log.createdAt;

            return (
              <div 
                key={log.id} 
                style={{ 
                  backgroundColor: '#0f172a', 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: '6px', 
                  borderLeft: '4px solid #38bdf8', 
                  borderTop: '1px solid #334155', 
                  borderRight: '1px solid #334155', 
                  borderBottom: '1px solid #334155', 
                  fontSize: '0.8rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}
              >
                <div>
                  <span style={{ color: '#e2e8f0' }}>
                    <strong style={{ color: '#38bdf8' }}>{actorName}</strong>: Durum <strong>{getStatusText(log.newStatus)}</strong> olarak değiştirildi.
                  </span>
                  {log.description && (
                    <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontStyle: 'italic' }}>
                      "{log.description}"
                    </p>
                  )}
                </div>
                <span style={{ color: '#64748b', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                  {date ? new Date(date).toLocaleString('tr-TR') : ''}
                </span>
              </div>
            );
          })
        ) : (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>Tarihçe kaydı bulunmuyor.</p>
        )}
      </div>
    </div>
  );
};