import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { requestApi } from '../api/requestApi';
import type { 
  RequestItem, 
  CreateRequestDto, 
  UpdateRequestStatusDto, 
  AddCommentDto 
} from '../types';

export const useRequests = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown, defaultMsg: string): string => {
    if (err instanceof AxiosError && err.response?.data) {
      const data = err.response.data;
      if (typeof data === 'string') return data;
      if (typeof data === 'object' && data.message) return data.message;
    }
    return defaultMsg;
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestApi.getAll();
      setRequests(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Talepler yüklenirken bir hata oluştu.'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRequestDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestApi.getById(id);
      setSelectedRequest(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Talep detayları yüklenemedi.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRequest = async (dto: CreateRequestDto) => {
    setActionLoading(true);
    setError(null);
    try {
      const newRequest = await requestApi.create(dto);
      await fetchRequests();
      return newRequest;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Talep oluşturulurken bir hata oluştu.');
      setError(msg);
      throw new Error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const updateStatus = async (dto: UpdateRequestStatusDto) => {
    setActionLoading(true);
    setError(null);
    try {
      await requestApi.updateStatus(dto);
      await fetchRequestDetails(dto.requestId);
      await fetchRequests();
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Talep durumu güncellenemedi.');
      setError(msg);
      throw new Error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const addComment = async (dto: AddCommentDto) => {
    setActionLoading(true);
    setError(null);
    try {
      await requestApi.addComment(dto);
      if (dto.requestId) {
        await fetchRequestDetails(dto.requestId);
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Yorum eklenirken bir hata oluştu.');
      setError(msg);
      throw new Error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    requests,
    selectedRequest,
    loading,
    actionLoading,
    error,
    fetchRequests,
    fetchRequestDetails,
    createRequest,
    updateStatus,
    addComment,
    setSelectedRequest
  };
};