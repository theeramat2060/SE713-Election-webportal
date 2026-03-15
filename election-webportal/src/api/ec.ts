import apiClient from './client';
import type {
  ApiResponse,
  Constituency,
  CloseVotingPayload,
  ConstituencyWinner,
} from './types';

export const ecApi = {
  /**
   * List all constituencies where is_closed=false — GET /api/ec/open-constituencies
   * Requires EC role (Bearer token).
   */
  getOpenConstituencies: async (): Promise<Constituency[]> => {
    const { data } = await apiClient.get<ApiResponse<Constituency[]>>(
      '/ec/open-constituencies',
    );
    return data.data ?? [];
  },

  /**
   * Open or close voting globally — POST /api/ec/close-voting
   * ⚠️  Backend currently closes ALL constituencies at once (known bug).
   * Body: { isClosed: true }  → closes voting
   * Body: { isClosed: false } → reopens voting
   */
  setVotingStatus: async (payload: CloseVotingPayload): Promise<void> => {
    await apiClient.post('/ec/close-voting', payload);
  },

  /**
   * Calculate and return winners for all closed constituencies.
   * POST /api/ec/declare-results
   */
  declareResults: async (): Promise<ConstituencyWinner[]> => {
    const { data } = await apiClient.post<ApiResponse<ConstituencyWinner[]>>(
      '/ec/declare-results',
    );
    return data.data ?? [];
  },
};
