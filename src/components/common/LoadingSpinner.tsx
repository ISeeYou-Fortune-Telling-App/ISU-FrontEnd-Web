import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div
        className={`${sizeClasses[size]} rounded-full border-b-2 border-indigo-600 animate-spin`}
        style={{ animationDuration: '1s' }}
      ></div>
    </div>
  );
};
