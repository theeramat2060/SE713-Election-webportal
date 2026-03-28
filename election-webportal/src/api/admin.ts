import apiClient from './client';
import type { ApiResponse } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface District {
  id: number;
  province: string;
  district_number: number;
  is_closed: boolean;
  created_at: string;
  total_voters?: number;
  total_votes_cast?: number;
  candidates?: Candidate[];
}

export interface Candidate {
  id: number;
  name: string;
  party_id: number;
  vote_count: number;
}

export interface User {
  id: string;
  nationalId: string;
  title?: string;
  firstName: string;
  lastName: string;
  address?: string;
  role: 'VOTER' | 'EC' | 'ADMIN';
  constituencyId?: number;
  hasVoted?: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface CreateUserPayload {
  nationalId: string;
  password: string;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  role: 'VOTER' | 'EC' | 'ADMIN';
  constituencyId?: number;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  address?: string;
  role?: 'VOTER' | 'EC' | 'ADMIN';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  constituencyId?: number;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  details?: string;
}

export interface ActivityLog {
  timestamp: string;
  action: string;
  result: string;
  ipAddress?: string;
  candidateId?: number;
  constituencyId?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════════════════════════

export const adminApi = {
  // ─────────────────────────────────────────────────────────────────────────
  // DISTRICT MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * List all districts with pagination and search
   * GET /api/admin/districts?page=1&pageSize=10&search=Bangkok
   */
  getAllDistricts: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<District>>> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));
    if (search) params.append('search', search);

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<District>>>(
      `/admin/districts?${params.toString()}`
    );
    return data;
  },

  /**
   * Get specific district with details and candidates
   * GET /api/admin/districts/:id
   */
  getDistrict: async (id: number): Promise<ApiResponse<District>> => {
    const { data } = await apiClient.get<ApiResponse<District>>(`/admin/districts/${id}`);
    return data;
  },

  /**
   * Create a new electoral district
   * POST /api/admin/districts
   */
  createDistrict: async (province: string, district_number: number): Promise<ApiResponse<District>> => {
    const { data } = await apiClient.post<ApiResponse<District>>(`/admin/districts`, {
      province,
      district_number,
    });
    return data;
  },

  /**
   * Delete an electoral district
   * DELETE /api/admin/districts
   */
  deleteDistrict: async (province: string, district_number: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/admin/districts`, {
      data: { province, district_number },
    });
    return data;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // USER MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * List all users with pagination, filtering, and search
   * GET /api/admin/users?page=1&pageSize=10&role=voter&search=john
   */
  getAllUsers: async (
    page: number = 1,
    pageSize: number = 10,
    role?: string,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));
    if (role) params.append('role', role);
    if (search) params.append('search', search);

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      `/admin/users?${params.toString()}`
    );
    return data;
  },

  /**
   * Get specific user details
   * GET /api/admin/users/:id
   */
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get<ApiResponse<User>>(`/admin/users/${id}`);
    return data;
  },

  /**
   * Create new user
   * POST /api/admin/users
   */
  createUser: async (payload: CreateUserPayload): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.post<ApiResponse<User>>('/admin/users', payload);
    return data;
  },

  /**
   * Update user details
   * PATCH /api/admin/users/:id
   */
  updateUser: async (id: string, payload: UpdateUserPayload): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}`, payload);
    return data;
  },

  /**
   * Delete user
   * DELETE /api/admin/users/:id
   */
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/admin/users/${id}`);
    return data;
  },

  /**
   * Change user role (VOTER -> EC)
   * PATCH /api/admin/users/:id/change-role
   */
  changeUserRole: async (id: string, role: 'VOTER' | 'EC'): Promise<ApiResponse<{ success: boolean }>> => {
    const { data } = await apiClient.patch<ApiResponse<{ success: boolean }>>(`/admin/users/${id}/change-role`, { role });
    return data;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AUDIT & LOGGING
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get voting audit trail with filters
   * GET /api/admin/audit-logs?page=1&action=vote&startDate=2026-03-20&endDate=2026-03-25
   */
  getAuditLogs: async (
    page: number = 1,
    pageSize: number = 50,
    action?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<PaginatedResponse<AuditLog>>> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));
    if (action) params.append('action', action);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AuditLog>>>(
      `/admin/audit-logs?${params.toString()}`
    );
    return data;
  },

  /**
   * Get user activity logs
   * GET /api/admin/users/:id/activity-logs?page=1&pageSize=20
   */
  getUserActivityLogs: async (
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<PaginatedResponse<ActivityLog>>> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<ActivityLog>>>(
      `/admin/users/${userId}/activity-logs?${params.toString()}`
    );
    return data;
  },
};
