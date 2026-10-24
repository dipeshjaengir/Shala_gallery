import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnetic } from './Magnetic';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenCommission: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenCommission,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'artwork', label: 'Paintings' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[99] bg-[#FAF9F6] border-b border-[#E7E2DA] shadow-xs py-3.5 sm:py-4">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Brand Wordmark */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer transition-opacity duration-300 hover:opacity-75 flex flex-col text-left"
        >
          <span className="font-serif text-sm sm:text-base md:text-lg tracking-[0.25em] uppercase font-light text-[#1F1E1B]">
            SHALAGALLERY
          </span>
          <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-[#6B665E] opacity-90 -mt-0.5">
            Asma Shala &bull; Fine Art Ireland
          </span>
        </div>

        {/* Center/Right Nav Controls */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 font-sans text-[10px] tracking-[0.22em] uppercase font-medium">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <Magnetic key={link.id} range={40} strength={0.25}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`relative py-1 cursor-pointer transition-colors duration-300 font-medium ${
                      isActive
                        ? 'text-[#8C7B50] font-semibold'
                        : 'text-[#4A4742] hover:text-[#1F1E1B]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavUnderline"
                        className="absolute bottom-0 left-0 w-full h-[1px] bg-[#8C7B50]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                </Magnetic>
              );
            })}
          </nav>

          {/* Quick Commission CTA Button */}
          <button
            onClick={onOpenCommission}
            className="hidden sm:inline-flex bg-[#1F1E1B] text-[#FAF9F6] border border-[#1F1E1B] hover:bg-transparent hover:text-[#1F1E1B] font-sans text-[9px] tracking-[0.25em] uppercase py-2 px-4 transition-all duration-300 font-semibold cursor-pointer"
          >
            Commission
          </button>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 cursor-pointer hover:opacity-75 transition-opacity text-[#1F1E1B]"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-0 z-[100] bg-[#FAF9F6] text-[#1F1E1B] p-8 flex flex-col justify-between"
          >
            {/* Drawer Top */}
            <div className="flex justify-between items-center pb-6 border-b border-[#E7E2DA]">
              <span className="font-serif text-sm tracking-[0.25em] uppercase font-light text-[#1F1E1B]">
                SHALAGALLERY
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 cursor-pointer text-[#1F1E1B] hover:text-[#8C7B50] transition-colors"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Links list */}
            <div className="flex flex-col gap-5 my-auto text-left">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`font-serif text-2xl uppercase tracking-widest text-left transition-colors flex items-center justify-between ${
                    activeTab === link.id
                      ? 'text-[#8C7B50] font-medium'
                      : 'text-[#1F1E1B] hover:text-[#8C7B50]'
                  }`}
                >
                  <span>{link.label}</span>
                  {activeTab === link.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C7B50]" />
                  )}
                </button>
              ))}
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-[#E7E2DA] flex flex-col gap-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommission();
                }}
                className="w-full py-3 bg-[#1F1E1B] text-[#FAF9F6] font-sans text-[10px] tracking-[0.25em] uppercase font-semibold text-center hover:bg-[#8C7B50] transition-colors"
              >
                Commission a Piece
              </button>

              <div className="flex justify-between items-center text-[9px] font-sans text-theme-text-muted tracking-widest uppercase">
                <span>Asma Shala &bull; Ireland</span>
                <a
                  href="https://www.instagram.com/shalagallery/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-theme-accent"
                >
                  @shalagallery
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
