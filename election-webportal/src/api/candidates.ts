import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Candidate,
  CreateCandidatePayload,
  UpdateCandidatePayload,
} from './types';

export const candidatesApi = {
  /**
   * List candidates, optionally filtered — GET /candidates  (public)
   */
  getAll: async (params?: {
    districtId?: string;
    partyId?: string;
  }): Promise<Candidate[]> => {
    const { data } = await apiClient.get<PaginatedResponse<Candidate>>(
      '/candidates',
      { params },
    );
    return data.data;
  },

  /**
   * Get a single candidate — GET /candidates/:id  (public)
   */
  getById: async (id: string): Promise<Candidate> => {
    const { data } = await apiClient.get<ApiResponse<Candidate>>(
      `/candidates/${id}`,
    );
    return data.data;
  },

  /**
   * Create a candidate — POST /candidates  (ec)
   */
  create: async (payload: CreateCandidatePayload): Promise<Candidate> => {
    const { data } = await apiClient.post<ApiResponse<Candidate>>(
      '/candidates',
      payload,
    );
    return data.data;
  },

  /**
   * Update a candidate — PUT /candidates/:id  (ec)
   */
  update: async (
    id: string,
    payload: UpdateCandidatePayload,
  ): Promise<Candidate> => {
    const { data } = await apiClient.put<ApiResponse<Candidate>>(
      `/candidates/${id}`,
      payload,
    );
    return data.data;
  },

  /**
   * Delete a candidate — DELETE /candidates/:id  (ec)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/candidates/${id}`);
  },

  /**
   * Upload candidate photo — POST /candidates/:id/photo  (ec)
   * Returns the new photo URL.
   */
  uploadPhoto: async (id: string, file: File): Promise<string> => {
    const form = new FormData();
    form.append('photo', file);
    const { data } = await apiClient.post<ApiResponse<{ photoUrl: string }>>(
      `/candidates/${id}/photo`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data.data.photoUrl;
  },
};
