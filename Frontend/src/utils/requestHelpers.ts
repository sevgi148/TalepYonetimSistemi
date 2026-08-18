import { RequestStatus, RequestPriority } from '../types';

export const getStatusText = (status: RequestStatus): string => {
  switch (status) {
    case RequestStatus.New:
      return 'New';
    case RequestStatus.Assigned:
      return 'Assigned';
    case RequestStatus.InProgress:
      return 'In Progress';
    case RequestStatus.Resolved:
      return 'Resolved';
    case RequestStatus.Closed:
      return 'Closed';
    default:
      return 'Unknown';
  }
};

export const getStatusColor = (status: RequestStatus): { bg: string; text: string; border?: string } => {
  switch (status) {
    case RequestStatus.New:
      return { bg: '#78350f', text: '#fef3c7', border: '#f59e0b' };
    case RequestStatus.Assigned:
      return { bg: '#3b0764', text: '#f3e8ff', border: '#c084fc' };
    case RequestStatus.InProgress:
      return { bg: '#0c4a6e', text: '#e0f2fe', border: '#38bdf8' };
    case RequestStatus.Resolved:
      return { bg: '#064e3b', text: '#d1fae5', border: '#10b981' };
    case RequestStatus.Closed:
      return { bg: '#881337', text: '#ffe4e6', border: '#f43f5e' };
    default:
      return { bg: '#334155', text: '#cbd5e1' };
  }
};

export const getPriorityText = (priority: RequestPriority): string => {
  switch (priority) {
    case RequestPriority.Low:
      return 'Low';
    case RequestPriority.Medium:
      return 'Medium';
    case RequestPriority.High:
      return 'High';
    case RequestPriority.Urgent:
      return 'Urgent';
    default:
      return 'Medium';
  }
};

export const getPriorityColor = (priority: RequestPriority): { bg: string; text: string } => {
  switch (priority) {
    case RequestPriority.Low:
      return { bg: '#1e293b', text: '#94a3b8' };
    case RequestPriority.Medium:
      return { bg: '#075985', text: '#e0f2fe' };
    case RequestPriority.High:
      return { bg: '#9a3412', text: '#ffedd5' };
    case RequestPriority.Urgent:
      return { bg: '#991b1b', text: '#fee2e2' };
    default:
      return { bg: '#1e293b', text: '#94a3b8' };
  }
};
