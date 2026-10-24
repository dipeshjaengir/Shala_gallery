import React, { useState } from 'react';
import { ArtworkWithAsset, ARTWORKS_DATA } from '../data/artworks';
import { ArtworkCard } from '../components/ArtworkCard';
import { SectionHeader } from '../components/SectionHeader';
import { SectionContainer } from '../components/SectionContainer';
import { Button } from '../components/Button';

interface PreviousCommissionsPageProps {
  onSelectArtwork: (artwork: ArtworkWithAsset) => void;
  onRoomView: (artwork: ArtworkWithAsset) => void;
  onInquire: (artwork: ArtworkWithAsset) => void;
  onOpenCommission: () => void;
}

export const PreviousCommissionsPage: React.FC<PreviousCommissionsPageProps> = ({
  onSelectArtwork,
  onRoomView,
  onInquire,
  onOpenCommission,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Islamic-Inspired' | 'Landscapes & Nature'>('All');

  const allCommissions = ARTWORKS_DATA.filter((a) => a.category === 'Previous Commissions');
  const islamicCommissions = allCommissions.filter((a) => a.commissionSubtype === 'Islamic-Inspired');
  const landscapeCommissions = allCommissions.filter((a) => a.commissionSubtype === 'Landscapes & Nature');

  const filterTabs: Array<'All' | 'Islamic-Inspired' | 'Landscapes & Nature'> = [
    'All',
    'Islamic-Inspired',
    'Landscapes & Nature',
  ];

  return (
    <div className="w-full bg-theme-bg text-theme-text pt-4 sm:pt-6 pb-20">
      <SectionContainer>
        {/* Main Section Header */}
        <SectionHeader
          label="COMMISSIONS ACROSS 6 COUNTRIES"
          title={
            activeFilter === 'Islamic-Inspired'
              ? 'Previous Commissions – Islamic-Inspired'
              : activeFilter === 'Landscapes & Nature'
              ? 'Previous Commissions – Landscapes & Nature'
              : 'Previous Commissions'
          }
        />

        <div className="max-w-3xl mb-10 text-left">
          <p className="font-sans text-xs md:text-sm text-theme-text-muted opacity-80 leading-relaxed uppercase tracking-wider">
            Each commissioned painting is developed collaboratively around the client&rsquo;s story, memory, or personal feeling. With 7 years of creating bespoke artwork, Asma’s commissioned pieces now anchor private residences and meaningful interiors across Ireland and internationally.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="mb-12 pb-6 border-b border-theme-border flex flex-wrap items-center gap-3">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            const count =
              tab === 'All'
                ? allCommissions.length
                : tab === 'Islamic-Inspired'
                ? islamicCommissions.length
                : landscapeCommissions.length;

            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`font-sans text-[10px] tracking-[0.2em] uppercase py-2 px-4 transition-all duration-300 border cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'border-theme-accent bg-theme-accent text-gallery-black font-semibold'
                    : 'border-theme-border bg-theme-bg-card text-theme-text-muted hover:border-theme-text hover:text-theme-text'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs ${isActive ? 'bg-gallery-black/15 text-gallery-black' : 'bg-theme-bg-surface text-theme-text-muted'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Display when activeFilter === 'Islamic-Inspired' */}
        {activeFilter === 'Islamic-Inspired' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {islamicCommissions.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onSelect={onSelectArtwork}
                onRoomView={onRoomView}
                onInquire={onInquire}
              />
            ))}
          </div>
        )}

        {/* Display when activeFilter === 'Landscapes & Nature' */}
        {activeFilter === 'Landscapes & Nature' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {landscapeCommissions.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onSelect={onSelectArtwork}
                onRoomView={onRoomView}
                onInquire={onInquire}
              />
            ))}
          </div>
        )}

        {/* Display when activeFilter === 'All': Render both sections clearly */}
        {activeFilter === 'All' && (
          <div className="space-y-20">
            {/* Section 1: Previous Commissions – Islamic-Inspired */}
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-theme-border">
                <div className="text-left">
                  <span className="text-[9px] font-sans tracking-[0.25em] text-theme-accent uppercase font-semibold block mb-1">
                    CURATED ARCHIVE
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-wide text-theme-text">
                    Previous Commissions – Islamic-Inspired
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-theme-text-muted tracking-widest uppercase">
                  {islamicCommissions.length} WORKS
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {islamicCommissions.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onSelect={onSelectArtwork}
                    onRoomView={onRoomView}
                    onInquire={onInquire}
                  />
                ))}
              </div>
            </div>

            {/* Section 2: Previous Commissions – Landscapes & Nature */}
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-theme-border">
                <div className="text-left">
                  <span className="text-[9px] font-sans tracking-[0.25em] text-theme-accent uppercase font-semibold block mb-1">
                    CURATED ARCHIVE
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-wide text-theme-text">
                    Previous Commissions – Landscapes &amp; Nature
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-theme-text-muted tracking-widest uppercase">
                  {landscapeCommissions.length} WORKS
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {landscapeCommissions.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onSelect={onSelectArtwork}
                    onRoomView={onRoomView}
                    onInquire={onInquire}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-24 p-8 sm:p-12 bg-theme-bg-surface border border-theme-border shadow-premium flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[9px] font-sans tracking-[0.25em] text-theme-accent uppercase font-semibold">
              START YOUR PROJECT
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light uppercase tracking-wide text-theme-text">
              Commission Bespoke Artwork
            </h3>
            <p className="font-sans text-xs text-theme-text-muted opacity-80 leading-relaxed uppercase tracking-wider">
              Explore our transparent price guide starting from €75 for intimate sizes to large statement compositions.
            </p>
          </div>

          <Button
            onClick={onOpenCommission}
            variant="gold"
            className="shrink-0"
          >
            VIEW PRICE GUIDE &bull; STEPS
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
};
