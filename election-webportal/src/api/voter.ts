import apiClient from './client';
import type { ApiResponse, CandidateResult } from './types';

export interface VoteRecord {
  id: number;
  userId: string;
  candidateId: number | null;
  constituencyId: number;
  votedAt: string;
}

export const voterApi = {
  /**
   * Get all candidates for the user's constituency — GET /api/voter/get-all-candidate
   * Returns an array of candidates.
   */
  getAllCandidates: async (): Promise<ApiResponse<CandidateResult[]>> => {
    const { data } = await apiClient.get<ApiResponse<CandidateResult[]>>('/voter/get-all-candidate');
    return data;
  },

  /**
   * Check if the current voter has already voted — GET /api/voter/my-vote
   * Returns vote record if voted, null if not voted yet.
   */
  getMyVote: async (): Promise<ApiResponse<VoteRecord | null>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<VoteRecord | null>>('/voter/my-vote');
      return data;
    } catch (error: any) {
      // If endpoint returns 404 or voter hasn't voted, return success with null
      if (error.response?.status === 404 || error.response?.data?.data === null) {
        return { success: true, data: null };
      }
      throw error;
    }
  },

  /**
   * Cast a vote — POST /api/voter/vote
   * Requires Bearer token (Voter role).
   */
  vote: async (payload: { candidateId: number | null; constituencyId: number }): Promise<ApiResponse<VoteRecord>> => {
    const { data } = await apiClient.post<ApiResponse<VoteRecord>>('/voter/vote', payload);
    return data;
  },
};
