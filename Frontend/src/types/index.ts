export const RequestStatus = {
  New: 1,
  InProgress: 2,
  Assigned: 3,
  Resolved: 4,
  Closed: 5,
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

export const RequestType = {
  Hardware: 1,
  Software: 2,
  Access: 3,
  Other: 4,
} as const;

export type RequestType = typeof RequestType[keyof typeof RequestType];

export const RequestPriority = {
  Low: 1,
  Medium: 2,
  High: 3,
  Urgent: 4,
} as const;

export type RequestPriority = typeof RequestPriority[keyof typeof RequestPriority];

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  role?: string;
}

export interface IdentityResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserRegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface RequestComment {
  id: string;
  requestId: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: UserSummary;
  userFullName?: string;
}

export interface RequestHistory {
  id: string;
  requestId: string;
  userId: string;
  oldStatus?: RequestStatus;
  newStatus: RequestStatus;
  description?: string;
  createdAt: string;
  user?: UserSummary;
  userName?: string;
}
export interface RequestItem {
  id: string;
  title: string;
  description: string;
  requestType?: RequestType | string;
  priority: RequestPriority;
  status: RequestStatus;
  createdByUserId: string;
  createdByUser?: UserSummary;
  createdByFullName?: string;
  assignedToUserId?: string;
  assignedToUser?: UserSummary;
  assignedToFullName?: string;
  createdAt: string;
  updatedAt?: string;
  comments?: RequestComment[];
  requestHistories?: RequestHistory[];
}

export interface CreateRequestDto {
  title: string;
  description: string;
  requestType: string;
  priority: RequestPriority;
  createdByUserId?: string;
}

export interface UpdateRequestStatusDto {
  requestId: string;
  newStatus: RequestStatus;
  assignedToUserId?: string;
  description?: string;
}

export interface AddCommentDto {
  requestId: string;
  content: string;
  userId?: string;
}
export interface DashboardSummaryDto {
  totalRequests: number;
  newRequests: number;
  assignedRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  cancelledRequests: number;
}