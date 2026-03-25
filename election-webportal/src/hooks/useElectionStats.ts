import { useState, useEffect } from 'react';
import apiClient from '../api/client';

/**
 * Hook to fetch and manage election statistics from /public/election-status
 * Returns: totalCandidates, totalParties, totalConstituencies, and status info
 */

interface ElectionStats {
  totalCandidates: number;
  totalParties: number;
  totalConstituencies: number;
  openConstituencies: number;
  closedConstituencies: number;
  isVotingClosed: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useElectionStats = (): ElectionStats => {
  const [stats, setStats] = useState<ElectionStats>({
    totalCandidates: 0,
    totalParties: 0,
    totalConstituencies: 0,
    openConstituencies: 0,
    closedConstituencies: 0,
    isVotingClosed: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Fetch from GET /public/election-status (base URL already includes /api)
        const response = await apiClient.get('/public/election-status');
        const data = response.data;

        console.log('🔍 useElectionStats: API response', data);

        if (data.success && data.data) {
          setStats({
            totalCandidates: data.data.totalCandidates || 0,
            totalParties: data.data.totalParties || 0,
            totalConstituencies: data.data.totalConstituencies || 0,
            openConstituencies: data.data.openConstituencies || 0,
            closedConstituencies: data.data.closedConstituencies || 0,
            isVotingClosed: data.data.isVotingClosed || false,
            isLoading: false,
            error: null,
          });
          console.log('✅ useElectionStats: Stats loaded successfully', {
            totalCandidates: data.data.totalCandidates,
            totalParties: data.data.totalParties,
            totalConstituencies: data.data.totalConstituencies,
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('❌ useElectionStats: Failed to fetch election stats:', err);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load election statistics',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
