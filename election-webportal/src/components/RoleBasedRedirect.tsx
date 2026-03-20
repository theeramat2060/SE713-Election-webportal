import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';

export const RoleBasedRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-democracy"></div>
      </div>
    );
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    const roleRedirects = {
      voter: '/voter/vote',
      ec: '/ec/parties',
      admin: '/admin/districts'
    };
    return <Navigate to={roleRedirects[user.role]} replace />;
  }

  // If not authenticated, show landing page
  return <LandingPage />;
};