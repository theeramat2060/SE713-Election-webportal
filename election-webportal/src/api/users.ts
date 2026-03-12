import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from './types';

export const usersApi = {
  /**
   * List all users — GET /users  (admin)
   */
  getAll: async (params?: {
    role?: string;
    status?: string;
  }): Promise<User[]> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>('/users', {
      params,
    });
    return data.data;
  },

  /**
   * Get a single user — GET /users/:id  (admin)
   */
  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  /**
   * Update user role — PATCH /users/:id/role  (admin)
   */
  updateRole: async (id: string, payload: UpdateUserRolePayload): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      `/users/${id}/role`,
      payload,
    );
    return data.data;
  },

  /**
   * Update user status — PATCH /users/:id/status  (admin)
   */
  updateStatus: async (
    id: string,
    payload: UpdateUserStatusPayload,
  ): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      `/users/${id}/status`,
      payload,
    );
    return data.data;
  },
};
