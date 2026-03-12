import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Party,
  CreatePartyPayload,
  UpdatePartyPayload,
} from './types';

export const partiesApi = {
  /**
   * List all parties — GET /parties  (public)
   */
  getAll: async (): Promise<Party[]> => {
    const { data } = await apiClient.get<PaginatedResponse<Party>>('/parties');
    return data.data;
  },

  /**
   * Get a single party with full candidate list — GET /parties/:id  (public)
   */
  getById: async (id: string): Promise<Party> => {
    const { data } = await apiClient.get<ApiResponse<Party>>(`/parties/${id}`);
    return data.data;
  },

  /**
   * Create a party — POST /parties  (ec)
   */
  create: async (payload: CreatePartyPayload): Promise<Party> => {
    const { data } = await apiClient.post<ApiResponse<Party>>('/parties', payload);
    return data.data;
  },

  /**
   * Update a party — PUT /parties/:id  (ec)
   */
  update: async (id: string, payload: UpdatePartyPayload): Promise<Party> => {
    const { data } = await apiClient.put<ApiResponse<Party>>(
      `/parties/${id}`,
      payload,
    );
    return data.data;
  },

  /**
   * Delete a party — DELETE /parties/:id  (ec)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/parties/${id}`);
  },

  /**
   * Upload party logo — POST /parties/:id/logo  (ec)
   * Sends multipart/form-data; returns the new logo URL.
   */
  uploadLogo: async (id: string, file: File): Promise<string> => {
    const form = new FormData();
    form.append('logo', file);
    const { data } = await apiClient.post<ApiResponse<{ logoUrl: string }>>(
      `/parties/${id}/logo`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data.data.logoUrl;
  },
};
