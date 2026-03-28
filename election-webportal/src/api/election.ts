import apiClient from './client';
import type { ApiResponse, VotePayload, CandidateResult, ElectionStatusResponse, ElectionStatusConstituency, ElectionStatusSummaryResponse, ElectionStatusSummary } from './types';

export const electionApi = {
  /**
   * Get candidates for the logged-in user's district — GET /api/election/candidates/:userId
   * Backend returns an array of candidates directly in data.
   */
  getCandidatesByUserId: async (userId: string): Promise<ApiResponse<CandidateResult[]>> => {
    const { data } = await apiClient.get<ApiResponse<CandidateResult[]>>(`/election/candidates/${userId}`);
    return data;
  },

  /**
   * Cast a vote — POST /api/election/vote
   * Requires Bearer token (Voter role).
   */
  vote: async (payload: VotePayload): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.post<ApiResponse<void>>('/election/vote', payload);
    return data;
  },

  /**
   * Get detailed election status for all constituencies — GET /api/public/constituencies-status
   * Returns detailed array of constituency statuses (if available).
   */
  getElectionStatus: async (): Promise<ElectionStatusConstituency[]> => {
    try {
      const { data } = await apiClient.get<ElectionStatusResponse>('/public/constituencies-status');
      return data.data ?? [];
    } catch (error) {
      console.warn('Failed to fetch detailed election status:', error);
      return [];
    }
  },
};
