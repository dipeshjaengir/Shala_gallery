import { useState, useEffect } from 'react';
import { Mail, ArrowUp, Palette } from 'lucide-react';
import { ThemeProvider } from './utils/ThemeContext';
import { ArtworksProvider, useArtworks } from './context/ArtworksContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ArtworkModal } from './components/ArtworkModal';
import { RoomViewModal } from './components/RoomViewModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AvailableArtworkPage } from './pages/AvailableArtworkPage';
import { PreviousCommissionsPage } from './pages/PreviousCommissionsPage';
import { CalligraphyPage } from './pages/CalligraphyPage';
import { CommissionsPage } from './pages/CommissionsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPortal } from './components/AdminPortal';
import { ArtworkWithAsset } from './data/artworks';

// Inline Instagram SVG Icon
const InstagramIcon = ({ size = 15 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

function AppContent() {
  const { artworks } = useArtworks();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkWithAsset | null>(null);
  const [roomViewArtwork, setRoomViewArtwork] = useState<ArtworkWithAsset | null>(null);

  // Form prefill
  const [inquiryArtworkTitle, setInquiryArtworkTitle] = useState<string>('');
  const [inquiryType, setInquiryType] = useState<any>('Custom Commission');
  const [inquiryDimensions, setInquiryDimensions] = useState<string>('');

  // Scroll Progress and Back-to-Top
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check URL on load for direct access to admin portal (?tab=admin or /admin or token parameter)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'admin' || window.location.pathname === '/admin' || params.has('token') || params.get('action') === 'setup') {
      setActiveTab('admin');
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
          setScrollProgress(progress);
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (tab: string, category?: string) => {
    if (category) {
      setCategoryFilter(category);
    }
    setActiveTab(tab);
    if (tab === 'admin') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'admin');
      window.history.pushState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      if (url.searchParams.get('tab') === 'admin') {
        url.searchParams.delete('tab');
        url.searchParams.delete('action');
        url.searchParams.delete('token');
        window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    }
  };

  const handleOpenCommission = () => {
    setActiveTab('commissions');
  };

  const handleInquire = (artwork: ArtworkWithAsset) => {
    setInquiryArtworkTitle(artwork.title);
    setInquiryDimensions(artwork.dimensions || '');
    if (artwork.category === 'Arabic Calligraphy') {
      setInquiryType('Arabic Calligraphy');
    } else if (artwork.status === 'available') {
      setInquiryType('Existing Artwork');
    } else {
      setInquiryType('Custom Commission');
    }
    setActiveTab('contact');
  };

  const handleDiscussCommission = () => {
    setInquiryArtworkTitle('');
    setInquiryType('Custom Commission');
    setInquiryDimensions('');
    setActiveTab('contact');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-700 bg-theme-bg text-theme-text">
      {/* Scroll Progress Bar at the top */}
      <div
        className="fixed top-0 left-0 h-[2.5px] z-[9999] bg-theme-accent transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Top Editorial Navbar */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenCommission={handleOpenCommission}
      />

      {/* Main Pages */}
      <main className="relative z-10 w-full flex-grow pt-14 sm:pt-16">
        {activeTab === 'home' && (
          <HomePage
            artworks={artworks}
            onNavigate={handleNavigate}
            onSelectArtwork={setSelectedArtwork}
            onInquire={handleInquire}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenCommission={handleOpenCommission}
          />
        )}

        {activeTab === 'artwork' && (
          <AvailableArtworkPage
            artworks={artworks}
            initialCategory={categoryFilter}
            onSelectArtwork={setSelectedArtwork}
            onRoomView={setRoomViewArtwork}
            onInquire={handleInquire}
            onOpenCommission={handleOpenCommission}
          />
        )}

        {activeTab === 'previous-commissions' && (
          <PreviousCommissionsPage
            artworks={artworks}
            onSelectArtwork={setSelectedArtwork}
            onRoomView={setRoomViewArtwork}
            onInquire={handleInquire}
            onOpenCommission={handleOpenCommission}
          />
        )}

        {activeTab === 'calligraphy' && (
          <CalligraphyPage
            artworks={artworks}
            onSelectArtwork={setSelectedArtwork}
            onRoomView={setRoomViewArtwork}
            onInquire={handleInquire}
            onOpenCommission={handleOpenCommission}
          />
        )}

        {activeTab === 'commissions' && (
          <CommissionsPage onDiscussCommission={handleDiscussCommission} />
        )}

        {activeTab === 'contact' && (
          <ContactPage
            initialArtworkTitle={inquiryArtworkTitle}
            initialInquiryType={inquiryType}
            initialDimensions={inquiryDimensions}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal onNavigate={handleNavigate} />
        )}
      </main>

      {/* Luxury Minimal Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Action Dock (Hidden in admin mode to prevent overlapping admin controls) */}
      {activeTab !== 'admin' && (
        <div
          className="fixed right-4 sm:right-8 z-[70] flex flex-col gap-2.5 sm:gap-3 items-center"
          style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {/* Email Trigger */}
          <div className="relative group flex items-center">
            <span className="pointer-events-none absolute right-full mr-2.5 px-2 py-1 rounded bg-[#1F1E1B] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#1F1E1B] text-[9px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
              Email
            </span>
            <a
              href="mailto:shalagallery@gmail.com"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-theme-border bg-theme-bg-card text-theme-text hover:bg-theme-bg-surface transition-all duration-300 transform active:scale-95 cursor-pointer shadow-md hover:translate-y-[-2px] flex items-center justify-center"
              title="Email Asma Shala"
              aria-label="Send email to Asma Shala"
            >
              <Mail size={15} />
            </a>
          </div>

          {/* Instagram Trigger */}
          <div className="relative group flex items-center">
            <span className="pointer-events-none absolute right-full mr-2.5 px-2 py-1 rounded bg-[#1F1E1B] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#1F1E1B] text-[9px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
              Instagram
            </span>
            <a
              href="https://www.instagram.com/shalagallery/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-theme-border bg-theme-bg-card text-theme-text hover:bg-theme-bg-surface transition-all duration-300 transform active:scale-95 cursor-pointer shadow-md hover:translate-y-[-2px] flex items-center justify-center"
              title="Instagram @shalagallery"
              aria-label="Instagram profile @shalagallery"
            >
              <InstagramIcon size={15} />
            </a>
          </div>

          {/* Bespoke Commission Trigger */}
          <div className="relative group flex items-center">
            <span className="pointer-events-none absolute right-full mr-2.5 px-2 py-1 rounded bg-[#1F1E1B] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#1F1E1B] text-[9px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
              Commission
            </span>
            <button
              onClick={handleOpenCommission}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-theme-border bg-theme-bg-card text-theme-accent hover:bg-theme-bg-surface transition-all duration-300 transform active:scale-95 cursor-pointer shadow-md hover:translate-y-[-2px] flex items-center justify-center"
              title="Commission Artwork"
              aria-label="Request custom artwork commission"
            >
              <Palette size={15} />
            </button>
          </div>

          {/* Scroll-to-Top Trigger */}
          {showScrollTop && (
            <div className="relative group flex items-center">
              <span className="pointer-events-none absolute right-full mr-2.5 px-2 py-1 rounded bg-[#1F1E1B] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#1F1E1B] text-[9px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                Top
              </span>
              <button
                onClick={scrollToTop}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-theme-border bg-theme-bg-card text-theme-text hover:bg-theme-bg-surface transition-all duration-300 transform active:scale-95 cursor-pointer shadow-md hover:translate-y-[-2px] flex items-center justify-center"
                title="Scroll to Top"
                aria-label="Scroll to top"
              >
                <ArrowUp size={15} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        artworkList={artworks}
        onClose={() => setSelectedArtwork(null)}
        onInquire={handleInquire}
        onSelectArtwork={setSelectedArtwork}
      />

      {/* Room Scale Simulator */}
      <RoomViewModal
        artwork={roomViewArtwork}
        onClose={() => setRoomViewArtwork(null)}
        onInquire={handleInquire}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <ArtworksProvider>
        <AppContent />
      </ArtworksProvider>
    </ThemeProvider>
  );
}
