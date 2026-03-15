import apiClient from './client';
import type { AuthResponse, AuthMeResponse, LoginPayload, RegisterUserPayload, AdminLoginPayload, AdminRegisterPayload } from './types';

export const authApi = {
  /**
   * Voter / EC registration — POST /api/auth/register
   * Returns JWT token + user object on success.
   */
  register: async (payload: RegisterUserPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  /**
   * Voter / EC login — POST /api/auth/login
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  /**
   * Get current user info — GET /api/auth/me
   */
  getMe: async (): Promise<AuthMeResponse> => {
    const { data } = await apiClient.get<AuthMeResponse>('/auth/me');
    return data;
  },

  /**
   * Admin registration — POST /api/auth/admin/register
   */
  adminRegister: async (payload: AdminRegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/admin/register', payload);
    return data;
  },

  /**
   * Admin login — POST /api/auth/admin/login
   */
  adminLogin: async (payload: AdminLoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/admin/login', payload);
    return data;
  },
};
