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
   * Get aggregated election status — GET /api/public/election-status
   * Returns summary with global voting status and constituency counts.
   */
  getElectionStatusSummary: async (): Promise<ElectionStatusSummary> => {
    try {
      const { data } = await apiClient.get<ElectionStatusSummaryResponse>('/public/election-status');
      if (data.success && data.data) {
        return data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.warn('Failed to fetch election status summary, defaulting to open:', error);
      return {
        isVotingClosed: false,
        openConstituencies: 0,
        closedConstituencies: 0,
        totalConstituencies: 0,
      };
    }
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
      console.warn('Failed to fetch detailed election status, trying summary:', error);
      // Fallback: try to construct from summary if detailed endpoint not available
      try {
        const summary = await electionApi.getElectionStatusSummary();
        // Return empty array since we don't have detailed info
        return [];
      } catch (summaryError) {
        console.warn('Both detailed and summary endpoints failed:', summaryError);
        return [];
      }
    }
  },

  /**
   * Check if voting is globally closed (all constituencies closed)
   */
  isVotingGloballyClosed: async (): Promise<boolean> => {
    const summary = await electionApi.getElectionStatusSummary();
    return summary.isVotingClosed;
  },

  /**
   * Check if any constituency has results available (is closed)
   */
  hasAnyResults: async (): Promise<boolean> => {
    const summary = await electionApi.getElectionStatusSummary();
    return summary.closedConstituencies > 0;
  },

  /**
   * Get closed constituencies count
   */
  getClosedConstituenciesCount: async (): Promise<number> => {
    const summary = await electionApi.getElectionStatusSummary();
    return summary.closedConstituencies;
  },

  /**
   * Get open constituencies count  
   */
  getOpenConstituenciesCount: async (): Promise<number> => {
    const summary = await electionApi.getElectionStatusSummary();
    return summary.openConstituencies;
  },

  /**
   * Get all constituencies (both open and closed) from election status
   */
  getAllConstituencies: async (): Promise<any[]> => {
    try {
      const { data } = await apiClient.get<any>('/public/election-status');
      if (data.success && data.data?.constituencies) {
        console.log('📍 getAllConstituencies: Loaded', data.data.constituencies.length, 'constituencies');
        return data.data.constituencies;
      }
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch constituencies:', error);
      return [];
    }
  },
};
