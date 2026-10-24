import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ArtworkWithAsset } from '../data/artworks';
import { ArtworkVisual } from './ArtworkVisual';
import { Frame } from './Frame';

interface ArtworkCardProps {
  artwork: ArtworkWithAsset;
  onSelect: (artwork: ArtworkWithAsset) => void;
  onRoomView?: (artwork: ArtworkWithAsset) => void;
  onInquire: (artwork: ArtworkWithAsset) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onSelect,
  onInquire,
}) => {
  const isAvailable = artwork.status === 'available';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between"
    >
      <Frame className="p-4 md:p-5 flex flex-col justify-between h-full">
        {/* Clickable Image Container — Opens Expanded Lightbox View */}
        <div
          onClick={() => onSelect(artwork)}
          className="relative overflow-hidden w-full bg-theme-bg-surface border border-theme-border mb-4 flex items-center justify-center cursor-pointer transition-colors duration-500"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(artwork);
            }
          }}
          aria-label={`Open expanded view of ${artwork.title}`}
        >
          {/* Top Badges: Availability Status & Framing Status */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 select-none">
            {isAvailable ? (
              <span className="bg-theme-accent text-[8px] font-sans tracking-[0.22em] text-gallery-black uppercase py-1 px-2.5 font-bold shadow-sm">
                AVAILABLE
              </span>
            ) : (
              <span className="bg-theme-bg-surface border border-theme-border text-[8px] font-sans tracking-[0.22em] text-theme-text-muted uppercase py-1 px-2.5">
                COMMISSIONED
              </span>
            )}

            {artwork.framing && (
              <span className="bg-theme-bg-card/95 border border-theme-border-medium text-[8px] font-sans tracking-[0.2em] text-theme-text uppercase py-1 px-2 shadow-xs backdrop-blur-xs">
                {artwork.framing}
              </span>
            )}
          </div>

          {/* Original Artwork Image with object-contain */}
          <ArtworkVisual artwork={artwork} />
        </div>

        {/* Artwork Metadata */}
        <div className="flex flex-col text-left px-1 mt-auto">
          {/* Title & Dimensions */}
          <div className="flex justify-between items-baseline mb-3">
            <h3
              onClick={() => onSelect(artwork)}
              className="font-serif text-base font-light tracking-wide text-theme-text truncate pr-2 hover:text-theme-accent cursor-pointer transition-colors"
            >
              {artwork.title}
            </h3>
            {artwork.dimensions && (
              <span className="text-[10px] font-sans text-theme-text-muted font-mono shrink-0">
                {artwork.dimensions}
              </span>
            )}
          </div>

          {/* Price & Enquire Action Bar */}
          <div className="pt-3 border-t border-theme-border flex justify-between items-center text-[10px] font-sans tracking-widest uppercase font-medium">
            <div className="flex items-baseline gap-1.5">
              <span className="text-theme-accent font-serif text-sm sm:text-base font-light">
                {artwork.price ? artwork.price : (artwork.status === 'commissioned' ? 'Private Collection' : 'Price upon Inquiry')}
              </span>
            </div>

            <button
              onClick={() => onInquire(artwork)}
              className="text-theme-text hover:text-theme-accent transition-colors inline-flex items-center gap-1 ml-auto font-sans text-[9px] uppercase tracking-widest cursor-pointer font-semibold"
            >
              <span>{isAvailable ? 'ENQUIRE' : 'COMMISSION'}</span>
              <ArrowUpRight size={11} />
            </button>
          </div>
        </div>
      </Frame>
    </motion.div>
  );
};
