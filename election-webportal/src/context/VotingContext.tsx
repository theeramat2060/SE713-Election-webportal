import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VotingStatus {
  isVotingOpen: boolean;
  isVotingClosed: boolean;
  closedAt: Date | null;
  closedBy: string | null;
}

interface VotingContextType extends VotingStatus {
  closeVoting: (closedBy: string) => void;
  openVoting: () => void;
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

  // Load voting status from localStorage on mount
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

      // TODO: Add API call to sync with backend if needed
      // This could be implemented as:
      // try {
      //   const backendStatus = await api.getVotingStatus();
      //   if (backendStatus !== localStatus) {
      //     console.log('Syncing voting status with backend...');
      //     setVotingStatus(backendStatus);
      //   }
      // } catch (error) {
      //   console.log('Could not sync with backend, using local status');
      // }
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

  return (
    <VotingContext.Provider value={{
      ...votingStatus,
      closeVoting,
      openVoting,
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