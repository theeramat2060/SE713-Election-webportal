import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

type UserRole = 'voter' | 'ec' | 'admin';

interface User {
  id: string;
  nationalId: string;
  fullName: string;
  role: UserRole;
  districtId?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token) {
        try {
          // Attempt to sync with backend to get fresh user info
          const res = await authApi.getMe();
          if (res.success && res.user) {
            const userData: User = {
              id: res.user.id,
              nationalId: res.user.nationalId,
              fullName: `${res.user.title || ''}${res.user.firstName} ${res.user.lastName || ''}`.trim(),
              role: res.user.role === 'VOTER' ? 'voter' : 'ec',
              districtId: res.user.constituencyId?.toString(),
              title: res.user.title,
              firstName: res.user.firstName,
              lastName: res.user.lastName,
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else if (savedUser) {
            // Fallback to local storage if API fails but token exists
            setUser(JSON.parse(savedUser));
          }
        } catch (e) {
          console.error('Failed to fetch user info from backend');
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
