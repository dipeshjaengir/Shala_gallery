import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'gold';
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  href,
  type = 'button',
  variant = 'primary',
  className = '',
  target,
  rel,
  ...props
}) => {
  const baseClasses =
    'font-sans text-[10px] tracking-[0.22em] uppercase font-medium transition-all duration-300 transform active:scale-95 cursor-pointer select-none inline-flex items-center justify-center';

  const variantClasses = {
    primary:
      'bg-theme-text text-theme-bg border border-theme-text py-3.5 px-8 hover:bg-transparent hover:text-theme-text',
    secondary:
      'bg-theme-bg-surface text-theme-text border border-theme-border-medium py-3.5 px-8 hover:border-theme-text',
    outline:
      'bg-transparent text-theme-text border border-theme-border-medium py-3.5 px-8 hover:border-theme-text',
    text: 'bg-transparent text-theme-text hover:text-theme-accent p-2',
    gold: 'bg-theme-accent text-gallery-black border border-theme-accent py-3.5 px-8 hover:bg-transparent hover:text-theme-accent font-semibold',
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`;

  if (href) {
    return (
      <a href={href} className={finalClasses} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={finalClasses} {...props}>
      {children}
    </button>
  );
};
