import apiClient from './client';
import type { ApiResponse, PaginatedResponse, DistrictResult } from './types';

export const resultsApi = {
  /**
   * Get results for all districts — GET /results  (public)
   */
  getAll: async (): Promise<DistrictResult[]> => {
    const { data } =
      await apiClient.get<PaginatedResponse<DistrictResult>>('/results');
    return data.data;
  },

  /**
   * Get results for a specific district — GET /results/:districtId  (public)
   */
  getByDistrict: async (districtId: string): Promise<DistrictResult> => {
    const { data } = await apiClient.get<ApiResponse<DistrictResult>>(
      `/results/${districtId}`,
    );
    return data.data;
  },
};
