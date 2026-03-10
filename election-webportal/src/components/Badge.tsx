import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'authority';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  className = '',
}) => {
  const variants = {
    success: 'bg-democracy-light text-democracy border-democracy/20',
    error: 'bg-red-50 text-status-error border-status-error/20',
    warning: 'bg-amber-50 text-status-warning border-status-warning/20',
    info: 'bg-blue-50 text-status-info border-status-info/20',
    authority: 'bg-authority-light text-authority border-authority/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
