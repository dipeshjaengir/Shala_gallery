import React from 'react';
import { X, Maximize2 } from 'lucide-react';
import { ArtworkWithAsset } from '../data/artworks';
import { ArtworkVisual } from './ArtworkVisual';
import { Button } from './Button';

interface RoomViewModalProps {
  artwork: ArtworkWithAsset | null;
  onClose: () => void;
  onInquire: (artwork: ArtworkWithAsset) => void;
}

export const RoomViewModal: React.FC<RoomViewModalProps> = ({
  artwork,
  onClose,
  onInquire,
}) => {
  if (!artwork) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gallery-black/90 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-view-title"
    >
      <div className="relative w-full max-w-5xl bg-theme-bg-card border border-theme-border rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-theme-text transition-colors duration-500">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-theme-bg-surface border-b border-theme-border">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-theme-accent font-sans font-semibold block">
              RESIDENTIAL SCALE PREVIEW
            </span>
            <h3 id="room-view-title" className="text-lg sm:text-xl font-serif font-light uppercase tracking-wide text-theme-text">
              {artwork.title}
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => {
                onClose();
                onInquire(artwork);
              }}
              variant="gold"
              className="py-2 px-4 text-[9px]"
            >
              INQUIRE SPEC
            </Button>
            <button
              onClick={onClose}
              aria-label="Close Room View"
              className="p-2 text-theme-text-muted hover:text-theme-text transition rounded cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Room Simulation Canvas */}
        <div className="relative flex-1 min-h-[460px] bg-[#EAE5DD] dark:bg-[#1A1A1E] flex flex-col justify-between overflow-hidden p-6 sm:p-12 transition-colors duration-500">
          {/* Wall texture & Soft ambient lighting */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F2ECE2] via-[#E8E1D6] to-[#D5CCC0] dark:from-[#222228] dark:via-[#1A1A1E] dark:to-[#121215] opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.4)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.06)_0%,transparent_70%)]" />

          {/* Wall Molding Accent */}
          <div className="absolute top-0 left-0 right-0 h-4 border-b border-[#D0C6B8]/60 dark:border-white/5 bg-[#F4EFE6]/70 dark:bg-white/5" />

          {/* Hanging Artwork in Custom Floating Frame */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-6">
            <div className="flex flex-col items-center">
              <div className="w-1 h-3 bg-stone-dark/30 dark:bg-white/20 mb-0.5 rounded-full" />

              <div className="relative p-3 sm:p-4 bg-white/95 dark:bg-[#121214] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-[#C2B7A6] dark:border-white/10 rounded-xs max-w-[280px] sm:max-w-[340px] md:max-w-[420px] transition-all duration-500">
                <div className="p-3 bg-[#FAF8F5] dark:bg-[#0A0A0C] border border-stone-light/60 dark:border-white/5">
                  <ArtworkVisual artwork={artwork} className="max-h-[290px] object-contain shadow-sm" />
                </div>
              </div>

              {/* Placard below */}
              <div className="mt-4 px-3 py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-stone/30 dark:border-white/10 text-center rounded-xs text-[10px] text-theme-text font-sans tracking-widest uppercase">
                <span className="font-serif font-light">{artwork.title}</span>
                {artwork.dimensions ? ` \u2022 ${artwork.dimensions}` : (artwork.status === 'commissioned' ? ' \u2022 Private Collection' : '')}
              </div>
            </div>
          </div>

          {/* Interior Furniture Vignette (Minimalist Solid Wood Console Table) */}
          <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
            {/* Tabletop Items */}
            <div className="w-full flex justify-between px-12 sm:px-16 -mb-1 items-end">
              <div className="flex flex-col items-center opacity-85">
                <div className="w-0.5 h-12 bg-neutral-600 dark:bg-neutral-400 rotate-6" />
                <div className="w-8 h-14 bg-[#BFB2A2] dark:bg-[#34343A] rounded-t-full rounded-b-xs shadow-md border-t border-white/30" />
              </div>
              <div className="flex flex-col items-end opacity-90">
                <div className="w-16 h-2 bg-[#705E4D] dark:bg-[#2A2A30] rounded-xs" />
                <div className="w-20 h-3 bg-[#ECE5DB] dark:bg-[#3E3E46] border-b border-stone/40 dark:border-white/10 rounded-xs shadow-sm" />
              </div>
            </div>

            {/* Credenza / Tabletop Surface */}
            <div className="w-full h-4 bg-[#6A5A4A] dark:bg-[#1E1E22] rounded-t-xs shadow-md border-t border-[#877462] dark:border-white/10" />
            <div className="w-full h-12 bg-[#524436] dark:bg-[#161618] shadow-xl flex justify-between px-8 items-center border-t border-[#44382B] dark:border-white/5">
              <div className="w-2 h-2 rounded-full bg-theme-accent/60" />
              <div className="w-2 h-2 rounded-full bg-theme-accent/60" />
            </div>
            <div className="w-full flex justify-between px-6">
              <div className="w-3 h-10 bg-[#44382B] dark:bg-[#101012]" />
              <div className="w-3 h-10 bg-[#44382B] dark:bg-[#101012]" />
            </div>
          </div>

          {/* Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#B8ABA0] dark:bg-[#0E0E10] border-t border-[#9A8D80]/80 dark:border-white/5 opacity-90" />
        </div>

        {/* Footer Notes */}
        <div className="px-6 py-3 bg-theme-bg-surface text-theme-text-muted text-[10px] font-sans tracking-wider uppercase flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-theme-border">
          <p className="flex items-center gap-1.5 text-center sm:text-left">
            <Maximize2 size={12} className="text-theme-accent shrink-0" />
            <span>Simulated scale relative to standard 2.7m residential ceiling and 110cm console.</span>
          </p>
          <span className="text-theme-accent">
            Custom hardwood framing available upon request.
          </span>
        </div>
      </div>
    </div>
  );
};
