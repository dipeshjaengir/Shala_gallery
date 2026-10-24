import React, { useState } from 'react';
import { ArtworkWithAsset, ARTWORKS_DATA } from '../data/artworks';
import { ArtworkCard } from '../components/ArtworkCard';
import { SectionHeader } from '../components/SectionHeader';
import { SectionContainer } from '../components/SectionContainer';
import { Button } from '../components/Button';

interface AvailableArtworkPageProps {
  initialCategory?: string;
  onSelectArtwork: (artwork: ArtworkWithAsset) => void;
  onRoomView: (artwork: ArtworkWithAsset) => void;
  onInquire: (artwork: ArtworkWithAsset) => void;
  onOpenCommission: () => void;
}

type PaintingFilter = 'All' | 'Available' | 'Commission' | 'Arabic Calligraphy';

export const AvailableArtworkPage: React.FC<AvailableArtworkPageProps> = ({
  initialCategory,
  onSelectArtwork,
  onRoomView,
  onInquire,
  onOpenCommission,
}) => {
  const [activeFilter, setActiveFilter] = useState<PaintingFilter>(() => {
    if (initialCategory === 'Arabic Calligraphy') return 'Arabic Calligraphy';
    return 'All';
  });

  const filterTabs: PaintingFilter[] = [
    'All',
    'Available',
    'Commission',
    'Arabic Calligraphy',
  ];

  const filteredArtworks = ARTWORKS_DATA.filter((artwork) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Available') return artwork.status === 'available';
    if (activeFilter === 'Commission') return artwork.category === 'Previous Commissions' || artwork.status === 'commissioned';
    if (activeFilter === 'Arabic Calligraphy') return artwork.category === 'Arabic Calligraphy';
    return true;
  });

  return (
    <div className="w-full bg-theme-bg text-theme-text pt-4 sm:pt-6 pb-20">
      <SectionContainer>
        {/* Section Header */}
        <SectionHeader
          label="ORIGINAL ARTWORK CATALOGUE"
          title="Paintings &amp; Studies"
        />

        {/* Filter Navigation Bar — Exactly 4 filters */}
        <div className="mb-10 pb-5 border-b border-theme-border flex flex-wrap items-center gap-3" role="tablist">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                role="tab"
                aria-selected={isActive}
                className={`font-sans text-[10px] tracking-[0.2em] uppercase py-2 px-4 transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? 'border-theme-accent bg-theme-accent text-[#0C0C0C] font-semibold'
                    : 'border-theme-border bg-theme-bg-card text-theme-text-muted hover:border-theme-text hover:text-theme-text'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Artwork Grid */}
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onSelect={onSelectArtwork}
                onRoomView={onRoomView}
                onInquire={onInquire}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-theme-bg-card border border-theme-border p-8">
            <p className="font-serif text-lg uppercase tracking-widest text-theme-text mb-4">
              No paintings match the chosen filter.
            </p>
            <Button
              onClick={() => setActiveFilter('All')}
              variant="outline"
            >
              RESET FILTERS
            </Button>
          </div>
        )}

        {/* Commission Callout Banner */}
        <div className="mt-24 p-8 sm:p-12 bg-theme-bg-surface border border-theme-border relative shadow-premium flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-theme-accent" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-theme-accent" />

          <div className="space-y-2 max-w-2xl">
            <span className="text-[9px] font-sans tracking-[0.25em] text-theme-accent uppercase font-semibold">
              CUSTOM ACQUISITIONS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light uppercase tracking-wide text-theme-text">
              Commission Artwork for Your Space
            </h3>
            <p className="font-sans text-xs text-theme-text-muted opacity-80 leading-relaxed uppercase tracking-wider">
              If an original piece has already found its home or if you have specific dimensions in mind, Asma welcomes custom commissions developed collaboratively.
            </p>
          </div>

          <Button
            onClick={onOpenCommission}
            variant="gold"
            className="shrink-0"
          >
            COMMISSION A PIECE
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
};
