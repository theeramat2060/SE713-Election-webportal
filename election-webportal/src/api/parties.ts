import apiClient from './client';
import type { ApiResponse, Party, PartyDetails, PartyOverview } from './types';

export const partiesApi = {
  /**
   * List all parties (basic info) — GET /api/public/parties
   */
  getAll: async (): Promise<Party[]> => {
    const { data } = await apiClient.get<ApiResponse<Party[]>>('/public/parties');
    return data.data ?? [];
  },

  /**
   * Get a party with full candidate list — GET /api/public/parties/:id
   */
  getById: async (id: number): Promise<PartyDetails> => {
    const { data } = await apiClient.get<ApiResponse<PartyDetails>>(
      `/public/parties/${id}`,
    );
    return data.data!;
  },

  /**
   * Aggregated seat count per party (only from closed constituencies)
   * GET /api/public/party-overview
   */
  getOverview: async (): Promise<PartyOverview> => {
    const { data } = await apiClient.get<ApiResponse<PartyOverview>>(
      '/public/party-overview',
    );
    return data.data!;
  },
};
