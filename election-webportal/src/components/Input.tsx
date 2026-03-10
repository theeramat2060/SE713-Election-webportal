import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full h-12 ${icon ? 'pl-11' : 'px-4'} pr-4 rounded border bg-surface transition-all
            placeholder:text-text-secondary/50 text-text-primary
            focus:outline-none focus:ring-2 focus:ring-democracy/20 focus:border-democracy
            disabled:bg-surface-soft disabled:cursor-not-allowed
            ${error ? 'border-status-error ring-status-error/10' : 'border-surface-border'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-status-error">{error}</p>}
      {!error && helperText && <p className="text-sm text-text-secondary">{helperText}</p>}
    </div>
  );
};
