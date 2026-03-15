import apiClient from './client';
import type { ApiResponse, Constituency, ConstituencyResults } from './types';

export const constituenciesApi = {
  /**
   * List all constituencies (open + closed) — GET /api/public/constituencies
   */
  getAll: async (): Promise<Constituency[]> => {
    const { data } = await apiClient.get<ApiResponse<Constituency[]>>(
      '/public/constituencies',
    );
    return data.data ?? [];
  },

  /**
   * Get candidates + vote counts for one constituency.
   * Vote counts are 0 when is_closed=false, real counts when is_closed=true.
   * GET /api/public/constituencies/:id/results
   */
  getResults: async (id: number): Promise<ConstituencyResults> => {
    const { data } = await apiClient.get<ApiResponse<ConstituencyResults>>(
      `/public/constituencies/${id}/results`,
    );
    return data.data!;
  },
};
