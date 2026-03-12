import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Ballot,
  CreateBallotPayload,
  CastVotePayload,
} from './types';

export const ballotsApi = {
  /**
   * List all ballots — GET /ballots  (ec)
   */
  getAll: async (): Promise<Ballot[]> => {
    const { data } = await apiClient.get<PaginatedResponse<Ballot>>('/ballots');
    return data.data;
  },

  /**
   * Get a single ballot — GET /ballots/:id  (ec / voter)
   */
  getById: async (id: string): Promise<Ballot> => {
    const { data } = await apiClient.get<ApiResponse<Ballot>>(`/ballots/${id}`);
    return data.data;
  },

  /**
   * Get the active ballot for the current voter's district — GET /ballots/active
   */
  getActive: async (): Promise<Ballot> => {
    const { data } = await apiClient.get<ApiResponse<Ballot>>('/ballots/active');
    return data.data;
  },

  /**
   * Create a new ballot — POST /ballots  (ec)
   */
  create: async (payload: CreateBallotPayload): Promise<Ballot> => {
    const { data } = await apiClient.post<ApiResponse<Ballot>>('/ballots', payload);
    return data.data;
  },

  /**
   * Open a ballot — PATCH /ballots/:id/open  (ec)
   */
  open: async (id: string): Promise<Ballot> => {
    const { data } = await apiClient.patch<ApiResponse<Ballot>>(
      `/ballots/${id}/open`,
    );
    return data.data;
  },

  /**
   * Close a ballot — PATCH /ballots/:id/close  (ec)
   */
  close: async (id: string): Promise<Ballot> => {
    const { data } = await apiClient.patch<ApiResponse<Ballot>>(
      `/ballots/${id}/close`,
    );
    return data.data;
  },

  /**
   * Cast a vote — POST /ballots/:id/vote  (voter)
   */
  castVote: async (id: string, payload: CastVotePayload): Promise<void> => {
    await apiClient.post(`/ballots/${id}/vote`, payload);
  },

  /**
   * Delete a draft ballot — DELETE /ballots/:id  (ec)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/ballots/${id}`);
  },
};
