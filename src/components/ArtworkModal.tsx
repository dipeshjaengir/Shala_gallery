import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { ArtworkWithAsset, ARTWORKS_DATA } from '../data/artworks';

interface ArtworkModalProps {
  artwork: ArtworkWithAsset | null;
  onClose: () => void;
  onInquire: (artwork: ArtworkWithAsset) => void;
  onSelectArtwork?: (artwork: ArtworkWithAsset) => void;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({
  artwork,
  onClose,
  onInquire,
  onSelectArtwork,
}) => {
  const artworkList = ARTWORKS_DATA;
  const currentIndex = artwork ? artworkList.findIndex((a) => a.id === artwork.id) : -1;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!onSelectArtwork || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + artworkList.length) % artworkList.length;
    onSelectArtwork(artworkList[prevIndex]);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!onSelectArtwork || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % artworkList.length;
    onSelectArtwork(artworkList[nextIndex]);
  };

  useEffect(() => {
    if (!artwork) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artwork, currentIndex, onClose, onSelectArtwork, artworkList]);

  if (!artwork) return null;

  const isAvailable = artwork.status === 'available';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[1000] bg-[#FAF9F6] text-[#1F1E1B] overflow-y-auto select-none flex flex-col justify-between"
        role="dialog"
        aria-modal="true"
        aria-label={`Artwork exhibition view: ${artwork.title}`}
        onClick={onClose}
      >
        {/* Top Minimal Navigation Bar with Close Button */}
        <div
          className="sticky top-0 z-50 w-full flex justify-between items-center px-6 md:px-12 py-4 bg-[#FAF9F6]/90 backdrop-blur-xs border-b border-[#E7E2DA]/60"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] font-sans tracking-[0.25em] text-[#6B665E] uppercase font-mono">
            {currentIndex !== -1
              ? `${String(currentIndex + 1).padStart(2, '0')} / ${String(artworkList.length).padStart(2, '0')}`
              : 'SHALAGALLERY'}
          </div>

          {/* Minimal Close Button in Upper-Right Corner */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 py-1.5 px-3.5 border border-[#1F1E1B]/20 hover:border-[#1F1E1B] hover:bg-[#1F1E1B] hover:text-[#FAF9F6] transition-all text-[10px] tracking-[0.25em] uppercase font-semibold cursor-pointer rounded-xs"
            aria-label="Close exhibition view"
          >
            <span>CLOSE</span>
            <X size={15} />
          </button>
        </div>

        {/* Central Exhibition Area: Matching the Reference Screenshot Layout */}
        <div
          className="relative flex-grow flex items-center justify-center px-4 sm:px-8 md:px-14 py-8 md:py-12"
          onClick={onClose}
        >
          {/* Previous Artwork Navigation Arrow */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/95 hover:bg-[#1F1E1B] hover:text-[#FAF9F6] text-[#1F1E1B] border border-[#E7E2DA] shadow-md transition-all cursor-pointer transform active:scale-95"
            aria-label="Previous painting"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>

          {/* Next Artwork Navigation Arrow */}
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/95 hover:bg-[#1F1E1B] hover:text-[#FAF9F6] text-[#1F1E1B] border border-[#E7E2DA] shadow-md transition-all cursor-pointer transform active:scale-95"
            aria-label="Next painting"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>

          {/* Two-Column Presentation Container */}
          <div
            className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Column: Framed Artwork with Clean White Matting (Matching Reference Screenshot) */}
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex justify-center items-center"
            >
              <div className="relative w-full bg-white p-5 sm:p-8 md:p-12 border border-[#E5E0D8] shadow-sm flex items-center justify-center">
                <img
                  src={artwork.imageSrc}
                  alt={artwork.title}
                  className="max-h-[58vh] sm:max-h-[64vh] md:max-h-[68vh] w-auto h-auto object-contain select-none shadow-xs"
                />
              </div>
            </motion.div>

            {/* Right Column: Information Panel (Matching Reference Screenshot Exactly) */}
            <div className="lg:col-span-5 text-left flex flex-col justify-center">
              {/* Category / Medium Tag */}
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase font-medium text-[#8C7B50] mb-2 block">
                {artwork.category ? artwork.category.toUpperCase() : 'ORIGINAL ARTWORK'}
              </span>

              {/* Title in Uppercase */}
              <h2 className="font-sans sm:font-serif uppercase tracking-[0.14em] text-3xl sm:text-4xl lg:text-5xl font-light text-[#1F1E1B] leading-tight mb-6">
                {artwork.title}
              </h2>

              {/* Thin Divider Rule */}
              <div className="w-full h-[1px] bg-[#E7E2DA] mb-6" />

              {/* Structured Metadata Key-Value Rows */}
              <div className="space-y-4 mb-8">
                {/* Dimensions */}
                {artwork.dimensions && (
                  <div className="flex justify-between items-baseline py-1 border-b border-[#E7E2DA]/50">
                    <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] text-[#6B665E] uppercase font-medium">
                      DIMENSIONS
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-[#1F1E1B] font-medium">
                      {artwork.dimensions}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex justify-between items-baseline py-1 border-b border-[#E7E2DA]/50">
                  <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] text-[#6B665E] uppercase font-medium">
                    PRICE
                  </span>
                  <span className="text-sm sm:text-base font-serif text-[#1F1E1B] font-medium">
                    {artwork.price ? artwork.price : (artwork.status === 'commissioned' ? 'Private Collection' : 'Inquire')}
                  </span>
                </div>

                {/* Availability Status */}
                <div className="flex justify-between items-baseline py-1 border-b border-[#E7E2DA]/50">
                  <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] text-[#6B665E] uppercase font-medium">
                    AVAILABILITY STATUS
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] text-[#8C7B50] uppercase font-semibold">
                    {isAvailable ? 'FOR SALE' : 'COMMISSIONED'}
                  </span>
                </div>

                {/* Framing (if provided) */}
                {artwork.framing && (
                  <div className="flex justify-between items-baseline py-1 border-b border-[#E7E2DA]/50">
                    <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] text-[#6B665E] uppercase font-medium">
                      FRAMING
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] text-[#1F1E1B] uppercase font-medium">
                      {artwork.framing}
                    </span>
                  </div>
                )}
              </div>

              {/* Prominent Action Button: Matching "INQUIRE ABOUT ACQUISITION" in Reference */}
              <button
                onClick={() => {
                  onClose();
                  onInquire(artwork);
                }}
                className="w-full bg-[#1F1E1B] text-[#FAF9F6] hover:bg-[#8C7B50] transition-colors py-4 px-6 font-sans text-[11px] tracking-[0.25em] uppercase font-semibold flex items-center justify-center gap-2.5 cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <span>INQUIRE ABOUT ACQUISITION</span>
                <MessageSquare size={14} className="opacity-80" />
              </button>

              {/* Bottom Navigation Indicators & Mobile Arrow Controls */}
              <div className="flex justify-between items-center mt-8 pt-4">
                {/* Pagination Ring Indicator (matching reference screenshot circle) */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-[#1F1E1B]/30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1F1E1B]" />
                  </div>
                  <span className="text-[9px] font-mono text-[#6B665E] tracking-widest uppercase">
                    {currentIndex + 1} OF {artworkList.length}
                  </span>
                </div>

                {/* Mobile Previous / Next Arrows */}
                <div className="sm:hidden flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full border border-[#E7E2DA] bg-white text-[#1F1E1B] hover:bg-[#1F1E1B] hover:text-white"
                    aria-label="Previous artwork"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full border border-[#E7E2DA] bg-white text-[#1F1E1B] hover:bg-[#1F1E1B] hover:text-white"
                    aria-label="Next artwork"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
