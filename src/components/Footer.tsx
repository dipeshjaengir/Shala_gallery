import React from 'react';
import { Magnetic } from './Magnetic';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full mt-24 px-6 md:px-12 py-12 md:py-16 border-t border-theme-border bg-theme-bg-surface transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        {/* Left Side: Branding */}
        <div className="text-center md:text-left">
          <h4 className="font-serif text-lg tracking-[0.25em] uppercase font-light text-theme-text">
            SHALAGALLERY
          </h4>
          <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-theme-text-muted opacity-55 mt-1.5">
            Fine Art &amp; Arabic Calligraphy by Asma Shala
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3 text-[9px] font-sans text-theme-text-muted opacity-65 tracking-widest uppercase">
            <span>15+ Years Practice</span>
            <span>&bull;</span>
            <span>140+ Works Sold</span>
            <span>&bull;</span>
            <span>6 Countries</span>
          </div>
        </div>

        {/* Right Side: Contact Triggers with Magnetic Pull */}
        <div className="flex flex-col md:items-end gap-3 font-sans text-[10px] tracking-[0.2em] uppercase font-medium">
          <div className="flex justify-center gap-6">
            <Magnetic range={30} strength={0.3}>
              <a
                href="mailto:shalagallery@gmail.com"
                className="hover:text-theme-accent transition-colors"
              >
                EMAIL
              </a>
            </Magnetic>
            <Magnetic range={30} strength={0.3}>
              <a
                href="https://www.instagram.com/shalagallery/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-theme-accent transition-colors"
              >
                INSTAGRAM
              </a>
            </Magnetic>
            <Magnetic range={30} strength={0.3}>
              <button
                onClick={() => onNavigate('commissions')}
                className="hover:text-theme-accent transition-colors uppercase"
              >
                COMMISSIONS
              </button>
            </Magnetic>
            <Magnetic range={30} strength={0.3}>
              <button
                onClick={() => onNavigate('contact')}
                className="hover:text-theme-accent transition-colors uppercase"
              >
                INQUIRE
              </button>
            </Magnetic>
          </div>

          <span className="opacity-45 text-[8px] mt-1 tracking-[0.25em] text-center md:text-right font-sans">
            DIGITAL EXHIBITION ROOMS &bull; IRELAND &bull; WORLDWIDE DELIVERY
          </span>
        </div>
      </div>

      {/* Trademark Line */}
      <div className="max-w-7xl mx-auto mt-12 md:mt-16 pt-8 border-t border-theme-border opacity-70 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] tracking-[0.3em] uppercase text-theme-text-muted">
        <span>&copy; {currentYear} SHALAGALLERY. ALL RIGHTS RESERVED. ASMA SHALA.</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:text-theme-accent transition-colors cursor-pointer"
        >
          BACK TO TOP &uarr;
        </button>
      </div>
    </footer>
  );
};
