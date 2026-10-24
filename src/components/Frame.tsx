import React from 'react';

interface FrameProps {
  children: React.ReactNode;
  className?: string;
}

export const Frame: React.FC<FrameProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-theme-bg-card border border-theme-border shadow-premium p-4 md:p-5 relative transition-all duration-500 ${className}`}
    >
      {children}
    </div>
  );
};
