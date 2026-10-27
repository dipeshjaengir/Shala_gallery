import React from 'react';
import { ArtworkWithAsset, ARTWORKS_DATA } from '../data/artworks';
import { useArtworks } from '../context/ArtworksContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { SectionHeader } from '../components/SectionHeader';
import { SectionContainer } from '../components/SectionContainer';
import { Button } from '../components/Button';
import { Shield } from 'lucide-react';

interface CalligraphyPageProps {
  artworks?: ArtworkWithAsset[];
  onSelectArtwork: (artwork: ArtworkWithAsset) => void;
  onRoomView: (artwork: ArtworkWithAsset) => void;
  onInquire: (artwork: ArtworkWithAsset) => void;
  onOpenCommission: () => void;
}

export const CalligraphyPage: React.FC<CalligraphyPageProps> = ({
  artworks: propArtworks,
  onSelectArtwork,
  onRoomView,
  onInquire,
  onOpenCommission,
}) => {
  const { artworks: contextArtworks } = useArtworks();
  const artworkList = propArtworks || contextArtworks || ARTWORKS_DATA;
  const calligraphyWorks = artworkList.filter((a) => a.category === 'Arabic Calligraphy');

  return (
    <div className="w-full bg-theme-bg text-theme-text pt-4 sm:pt-6 pb-20">
      <SectionContainer>
        {/* Section Header */}
        <SectionHeader
          label="SACRED DISCIPLINE &bull; CONTEMPORARY FORM"
          title="Arabic Calligraphy Artwork"
        />

        <div className="max-w-3xl mb-12 text-left">
          <p className="font-sans text-xs md:text-sm text-theme-text-muted opacity-80 leading-relaxed uppercase tracking-wider">
            Original calligraphy and mixed-media compositions created with natural pigments and gold leaf accents. Asma honors classical stroke proportions while introducing expressive organic grounds and gold illumination.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {calligraphyWorks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onSelect={onSelectArtwork}
              onRoomView={onRoomView}
              onInquire={onInquire}
            />
          ))}
        </div>

        {/* Materiality & Craftsmanship Frame */}
        <div className="mt-20 p-8 sm:p-12 bg-theme-bg-card border border-theme-border relative shadow-premium">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-theme-accent" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-theme-accent" />

          <div className="flex flex-col sm:flex-row items-start gap-6 text-left">
            <div className="p-3 bg-theme-bg-surface border border-theme-border rounded-full text-theme-accent shrink-0">
              <Shield size={20} />
            </div>
            <div className="space-y-3">
              <h3 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-wide text-theme-text">
                Craftsmanship &amp; Material Integrity
              </h3>
              <p className="font-sans text-xs md:text-sm text-theme-text-muted opacity-80 leading-relaxed tracking-wider normal-case">
                Every calligraphic piece is crafted with patient devotion to classical Arabic letter balance and rhythm. Using heavy archival handmade papers, natural binders, and layered gesso grounds, each composition is designed to be an enduring heirloom for sacred or reflective spaces.
              </p>
              <div className="pt-2">
                <Button
                  onClick={onOpenCommission}
                  variant="gold"
                >
                  COMMISSION CUSTOM CALLIGRAPHY
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
