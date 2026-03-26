import apiClient from './client';
import type {
  ApiResponse,
  Constituency,
  CloseVotingPayload,
  UpdateVotingPayload,
  ConstituencyWinner,
  Party,
  ElectionStats,
  Candidate,
} from './types';

export interface PartyPagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PartyListResponse {
  success: boolean;
  data: Party[];
  pagination: PartyPagination;
}

export interface CandidatePagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CandidateListResponse {
  success: boolean;
  message?: string;
  data: Candidate[];
  pagination: CandidatePagination;
}

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
   * Update voting status with additional metadata — POST /api/ec/update-voting
   * Body: { action: 'close', closedBy: 'EC Official', closedAt: '2026-03-19...' }
   */
  updateVotingStatus: async (payload: UpdateVotingPayload): Promise<void> => {
    await apiClient.post('/ec/update-voting', payload);
  },

  /**
   * Get current voting status from backend
   * GET /api/ec/voting-status
   */
  getVotingStatus: async (): Promise<{ isVotingClosed: boolean }> => {
    try {
      const { data } = await apiClient.get<ApiResponse<{ isVotingClosed: boolean }>>(
        '/ec/voting-status',
      );
      return data.data ?? { isVotingClosed: false };
    } catch (error) {
      console.warn('Failed to fetch voting status from backend, assuming voting is open:', error);
      return { isVotingClosed: false };
    }
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

  /**
   * Get overall election statistics
   * GET /api/ec/election-stats
   */
  getElectionStats: async (): Promise<ElectionStats> => {
    const { data } = await apiClient.get<ApiResponse<ElectionStats>>(
      '/ec/election-stats',
    );
    return data.data!;
  },

  /**
   * List all parties with pagination — GET /api/ec/get-all-party
   */
  getParties: async (page = 1, pageSize = 10): Promise<PartyListResponse> => {
    const { data } = await apiClient.get<PartyListResponse>(
      `/ec/get-all-party?page=${page}&pageSize=${pageSize}`,
    );
    return data;
  },

  /**
   * Create a new party — POST /api/ec/create-party
   */
  createParty: async (formData: FormData): Promise<void> => {
    await apiClient.post('/ec/create-party', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete a party — DELETE /api/ec/delete-party/:id
   */
  deleteParty: async (id: number): Promise<void> => {
    await apiClient.delete(`/ec/delete-party/${id}`, {
      data: { id }, // Backend expects id in body based on ecRoutes.ts
    });
  },

  /**
   * List all candidates with pagination — GET /api/ec/get-all-candidates
   */
  getCandidates: async (page = 1, pageSize = 10, search = '', partyId?: string, constituencyId?: string): Promise<CandidateListResponse> => {
    let url = `/ec/get-all-candidates?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;
    if (partyId) url += `&partyId=${partyId}`;
    if (constituencyId) url += `&constituencyId=${constituencyId}`;
    
    const { data } = await apiClient.get<CandidateListResponse>(url);
    return data;
  },

  /**
   * Add a new candidate — POST /api/ec/AddCandidates
   */
  addCandidate: async (formData: FormData): Promise<void> => {
    await apiClient.post('/ec/AddCandidates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update a candidate — POST /api/ec/update-candidate/:id
   */
  updateCandidate: async (id: number, formData: FormData): Promise<void> => {
    await apiClient.post(`/ec/update-candidate/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete a candidate — DELETE /api/ec/delete-candidate/:id
   */
  deleteCandidate: async (id: number): Promise<void> => {
    await apiClient.delete(`/ec/delete-candidate/${id}`, {
      data: { id }, // Backend expects id in body based on ecRoutes.ts
    });
  },
};
