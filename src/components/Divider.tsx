import React from 'react';

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <hr
      className={`w-full h-[1px] border-none bg-theme-border opacity-100 transition-colors duration-500 ${className}`}
    />
  );
};
