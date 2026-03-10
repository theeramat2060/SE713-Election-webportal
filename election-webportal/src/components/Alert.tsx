import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-democracy" />,
    error: <AlertCircle className="w-5 h-5 text-status-error" />,
    info: <Info className="w-5 h-5 text-status-info" />,
    warning: <AlertTriangle className="w-5 h-5 text-status-warning" />,
  };

  const variants = {
    success: 'bg-democracy-light border-democracy/20 text-democracy',
    error: 'bg-red-50 border-status-error/20 text-status-error',
    info: 'bg-blue-50 border-status-info/20 text-status-info',
    warning: 'bg-amber-50 border-status-warning/20 text-status-warning',
  };

  return (
    <div className={`p-4 rounded border flex items-start gap-3 ${variants[type]} ${className}`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
