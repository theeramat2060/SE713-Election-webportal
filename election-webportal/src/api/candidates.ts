import apiClient from './client';
import type { ApiResponse, CandidateResult } from './types';

export interface CandidateDetails extends CandidateResult {
  // Additional fields that might be returned
  policy?: string;
  bio?: string;
}

export const candidatesApi = {
  /**
   * Get candidate details by ID — GET /api/public/candidates/:id
   * Returns detailed candidate information including party and image
   */
  getById: async (id: number): Promise<ApiResponse<CandidateDetails>> => {
    const { data } = await apiClient.get<ApiResponse<CandidateDetails>>(`/public/candidates/${id}`);
    return data;
  },

  /**
   * Get all candidates (with pagination if needed) — GET /api/public/candidates
   * Optional: GET /api/voter/get-all-candidate for voter view
   */
  getAll: async (): Promise<ApiResponse<CandidateResult[]>> => {
    const { data } = await apiClient.get<ApiResponse<CandidateResult[]>>('/public/candidates');
    return data;
  },
};
