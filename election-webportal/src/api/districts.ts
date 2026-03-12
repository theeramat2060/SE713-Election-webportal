import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  District,
  CreateDistrictPayload,
  UpdateDistrictPayload,
} from './types';

export const districtsApi = {
  /**
   * List all districts — GET /districts
   */
  getAll: async (): Promise<District[]> => {
    const { data } = await apiClient.get<PaginatedResponse<District>>('/districts');
    return data.data;
  },

  /**
   * Get single district — GET /districts/:id
   */
  getById: async (id: string): Promise<District> => {
    const { data } = await apiClient.get<ApiResponse<District>>(`/districts/${id}`);
    return data.data;
  },

  /**
   * Create a district — POST /districts  (admin)
   */
  create: async (payload: CreateDistrictPayload): Promise<District> => {
    const { data } = await apiClient.post<ApiResponse<District>>('/districts', payload);
    return data.data;
  },

  /**
   * Update a district — PUT /districts/:id  (admin)
   */
  update: async (id: string, payload: UpdateDistrictPayload): Promise<District> => {
    const { data } = await apiClient.put<ApiResponse<District>>(
      `/districts/${id}`,
      payload,
    );
    return data.data;
  },

  /**
   * Delete a district — DELETE /districts/:id  (admin)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/districts/${id}`);
  },
};
