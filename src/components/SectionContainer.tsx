import React from 'react';

export const SectionContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <section className={`max-w-7xl mx-auto px-6 md:px-12 w-full transition-all ${className}`}>
      {children}
    </section>
  );
};
