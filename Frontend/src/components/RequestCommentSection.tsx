import React, { useState } from 'react';
import type { RequestComment } from '../types';

interface RequestCommentSectionProps {
  requestId: string;
  comments?: RequestComment[];
  onAddComment: (requestId: string, content: string) => Promise<void>;
}

export const RequestCommentSection: React.FC<RequestCommentSectionProps> = ({
  requestId,
  comments,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(requestId, newComment.trim());
      setNewComment('');
    } catch (err: unknown) {
      console.error('Yorum eklenirken hata:', err);
      const message = err instanceof Error ? err.message : 'Yorum eklenemedi.';
      alert(`Hata: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#cbd5e1' }}>Yorumlar</h3>
      
      <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <input
          type="text"
          placeholder="Bir yorum yazın."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid #334155',
            backgroundColor: '#0f172a',
            color: '#fff',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            opacity: (!newComment.trim() || isSubmitting) ? 0.5 : 1
          }}
        >
          {isSubmitting ? 'Gönderiliyor.' : 'Gönder'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => {
            const authorName = 
              comment.user?.fullName || 
              comment.userFullName || 
              'Kullanıcı';

            return (
              <div 
                key={comment.id || `comment-${index}`} 
                style={{
                  backgroundColor: '#0f172a',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #334155',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  <strong style={{ color: '#38bdf8' }}>{authorName}</strong>
                  <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleString('tr-TR') : ''}</span>
                </div>
                <p style={{ margin: 0, color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>{comment.content}</p>
              </div>
            );
          })
        ) : (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>Henüz yorum yapılmamış.</p>
        )}
      </div>
    </div>
  );
};