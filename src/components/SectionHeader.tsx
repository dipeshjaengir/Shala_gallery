import React from 'react';

interface SectionHeaderProps {
  label?: string;
  title?: string;
  className?: string;
  titleClassName?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  className = '',
  titleClassName = '',
}) => {
  return (
    <header className={`max-w-7xl mx-auto mb-6 md:mb-8 text-left ${className}`}>
      {label && (
        <span className="text-[10px] font-sans tracking-[0.35em] uppercase font-semibold text-theme-accent mb-2 block">
          {label}
        </span>
      )}
      {title && (
        <h1
          className={`font-serif font-light tracking-wide uppercase leading-[1.15] text-theme-text ${titleClassName}`}
          style={titleClassName ? {} : { fontSize: 'clamp(1.75rem, 6vw, 3.8rem)' }}
        >
          {title}
        </h1>
      )}
    </header>
  );
};
