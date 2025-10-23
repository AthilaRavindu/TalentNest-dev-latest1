// src/components/ui/Input.tsx
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full py-3 px-4 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ${
              icon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-12' : ''} ${
              error ? 'border-red-500 focus:teal-red-500 focus:border-red-500' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';