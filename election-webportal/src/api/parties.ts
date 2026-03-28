import apiClient from './client';
import type { ApiResponse, Party, PartyDetails, PartyOverview, CreatePartyPayload, DeclareResultsResponse, ConstituencyWinner } from './types';

export const partiesApi = {
  /**
   * List all parties (basic info) — GET /api/public/parties
   */
  getAll: async (): Promise<Party[]> => {
    try {
      const { data } = await apiClient.get<ApiResponse<Party[]>>('/public/parties');
      const parties = data.data ?? [];
      
      // Filter and validate parties to ensure they have required fields
      const validParties = Array.isArray(parties) 
        ? parties.filter(party => 
            party && 
            typeof party === 'object' && 
            party.name && 
            typeof party.name === 'string'
          )
        : [];
      
      console.log(`✅ Parties fetched: ${validParties.length} valid items`);
      return validParties;
    } catch (error) {
      console.error('❌ Error fetching parties:', error);
      return [];
    }
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
   * Get all constituencies with candidates (always available, independent of voting status)
   * GET /api/public/constituencies-with-candidates
   */
  getConstituenciesWithCandidates: async (): Promise<any[]> => {
    const { data } = await apiClient.get<ApiResponse<any[]>>(
      '/public/constituencies-with-candidates',
    );
    return data.data ?? [];
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

  /**
   * Get detailed election results per constituency
   * GET /api/public/results
   */
  getResults: async (): Promise<ConstituencyWinner[]> => {
    const { data } = await apiClient.get<ApiResponse<ConstituencyWinner[]>>(
      '/public/results',
    );
    return data.data ?? [];
  },

  /**
   * Create a new party — POST /api/ec/create-party
   * Requires EC role (Bearer token).
   */
  create: async (payload: CreatePartyPayload): Promise<Party> => {
    const { data } = await apiClient.post<ApiResponse<Party>>(
      '/ec/create-party',
      payload
    );
    
    if (!data.success || !data.data) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Failed to create party');
    }
    
    return data.data;
  },

  /**
   * Create a new party with file upload — POST /api/ec/create-party
   * Requires EC role (Bearer token).
   * Supports FormData with logo file upload
   */
  createWithFile: async (formData: FormData): Promise<Party> => {
    try {
      const { data } = await apiClient.post<ApiResponse<Party>>(
        '/ec/create-party',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (!data.success || !data.data) {
        console.error('API Error - createWithFile response:', { 
          success: data.success, 
          data: data.data, 
          error: data.error 
        });
        throw new Error(
          typeof data.error === 'string' 
            ? data.error 
            : (data.error && typeof data.error === 'object' && 'message' in data.error 
              ? (data.error as any).message 
              : 'Failed to create party')
        );
      }
      
      return data.data;
    } catch (error: any) {
      console.error('createWithFile error:', error.response?.data || error.message);
      throw error;
    }
  },
};
