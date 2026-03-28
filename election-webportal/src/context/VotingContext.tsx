import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ecApi, electionApi, constituenciesApi } from '../api';
import type { ElectionStatusSummary, ElectionStatusConstituency } from '../api';

interface VotingStatus {
  isVotingOpen: boolean;
  isVotingClosed: boolean;
  closedAt: Date | null;
  closedBy: string | null;
}

interface VotingContextType extends VotingStatus {
  statusSummary: ElectionStatusSummary | null;
  constituencies: ElectionStatusConstituency[];
  isLoading: boolean;
  closeVoting: (closedBy: string) => void;
  openVoting: () => void;
  refreshStatus: () => Promise<void>;
  getConstituencyStatus: (province: string, districtNumber: number) => ElectionStatusConstituency | undefined;
  isConstituencyOpen: (province: string, districtNumber: number) => boolean;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

interface VotingProviderProps {
  children: ReactNode;
}

export const VotingProvider: React.FC<VotingProviderProps> = ({ children }) => {
  const [votingStatus, setVotingStatus] = useState<VotingStatus>({
    isVotingOpen: true,  // Default: voting is open
    isVotingClosed: false,
    closedAt: null,
    closedBy: null,
  });

  const [statusSummary, setStatusSummary] = useState<ElectionStatusSummary | null>(null);
  const [constituencies, setConstituencies] = useState<ElectionStatusConstituency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStatus = async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch all constituencies to determine voting status
      const allConstituencies = await constituenciesApi.getAll();
      setConstituencies(allConstituencies as ElectionStatusConstituency[]);
      
      // 2. Calculate if voting is globally closed
      // Voting is closed only if ALL constituencies are closed
      const allClosed = allConstituencies.length > 0 && 
        allConstituencies.every(c => c.is_closed === true);
      
      setVotingStatus(prev => ({
        ...prev,
        isVotingOpen: !allClosed,
        isVotingClosed: allClosed,
        // Preserve closedAt and closedBy if already set
        closedAt: allClosed && !prev.closedAt ? new Date() : prev.closedAt,
        closedBy: allClosed && !prev.closedBy ? 'System' : prev.closedBy,
      }));
    } catch (error) {
      console.error('Could not sync voting status from constituencies:', error);
      // Fallback: try to get status from EC API
      try {
        const backendStatus = await ecApi.getVotingStatus();
        setVotingStatus(prev => ({
          ...prev,
          isVotingOpen: !backendStatus.isVotingClosed,
          isVotingClosed: backendStatus.isVotingClosed,
        }));
      } catch (fallbackError) {
        console.error('Fallback voting status fetch also failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load voting status from localStorage on mount and sync with backend
  useEffect(() => {
    const initializeVotingStatus = async () => {
      // First, try to load from localStorage
      const savedStatus = localStorage.getItem('votingStatus');
      if (savedStatus) {
        try {
          const parsed = JSON.parse(savedStatus);
          setVotingStatus({
            ...parsed,
            closedAt: parsed.closedAt ? new Date(parsed.closedAt) : null,
          });
        } catch (error) {
          console.error('Failed to parse voting status from localStorage:', error);
        }
      }

      // Sync with backend
      await refreshStatus();
    };

    initializeVotingStatus();
  }, []);

  // Save voting status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('votingStatus', JSON.stringify(votingStatus));
  }, [votingStatus]);

  const closeVoting = (closedBy: string) => {
    setVotingStatus({
      isVotingOpen: false,
      isVotingClosed: true,
      closedAt: new Date(),
      closedBy,
    });
  };

  const openVoting = () => {
    setVotingStatus({
      isVotingOpen: true,
      isVotingClosed: false,
      closedAt: null,
      closedBy: null,
    });
  };

  const getConstituencyStatus = (province: string, districtNumber: number) => {
    return constituencies.find(
      c => c.province === province && c.district_number === districtNumber
    );
  };

  const isConstituencyOpen = (province: string, districtNumber: number) => {
    const status = getConstituencyStatus(province, districtNumber);
    return status ? !status.is_closed : !votingStatus.isVotingClosed;
  };

  return (
    <VotingContext.Provider value={{
      ...votingStatus,
      statusSummary,
      constituencies,
      isLoading,
      closeVoting,
      openVoting,
      refreshStatus,
      getConstituencyStatus,
      isConstituencyOpen,
    }}>
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};
