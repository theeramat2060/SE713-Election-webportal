import apiClient from './client';
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload } from './types';

export const authApi = {
  /**
   * Voter / EC login — POST /auth/login
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      payload,
    );
    return data.data;
  },

  /**
   * Admin login — POST /auth/admin/login
   */
  adminLogin: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/admin/login',
      payload,
    );
    return data.data;
  },

  /**
   * Voter self-registration — POST /auth/register
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      payload,
    );
    return data.data;
  },

  /**
   * Invalidate session server-side — POST /auth/logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
