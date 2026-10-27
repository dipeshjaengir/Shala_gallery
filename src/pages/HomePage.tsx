import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ArtworkWithAsset, ARTWORKS_DATA } from '../data/artworks';
import { useArtworks } from '../context/ArtworksContext';
import { ArtworkCard } from '../components/ArtworkCard';
import { Button } from '../components/Button';
import { Magnetic } from '../components/Magnetic';

interface HomePageProps {
  artworks?: ArtworkWithAsset[];
  onNavigate: (tab: string, categoryFilter?: string) => void;
  onSelectArtwork: (artwork: ArtworkWithAsset) => void;
  onInquire: (artwork: ArtworkWithAsset) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  artworks: propArtworks,
  onNavigate,
  onSelectArtwork,
  onInquire,
}) => {
  const { artworks: contextArtworks } = useArtworks();
  const artworkList = propArtworks || contextArtworks || ARTWORKS_DATA;
  const featuredArtworks = artworkList.filter((a) => a.featured);
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative z-10 w-full overflow-hidden">
      {/* 1. FULL-SCREEN IMMERSIVE HERO SECTION */}
      <section className="relative w-full h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-4rem)] min-h-[480px] flex items-center justify-center overflow-hidden border-b border-theme-border">
        {/* Full-bleed background image covering the entire viewport */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/ieyxmxrp/image/upload/v1793014209/shala_gallery/shala_gallery/artist-photo-calligraphy-hero.jpg"
            alt="Asma Shala creating Arabic calligraphy"
            className="w-full h-full object-cover object-[center_35%] sm:object-[center_30%]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {/* Subtle dark vignette/overlay to ensure text readability while keeping Asma visually prominent */}
          <div className="absolute inset-0 bg-black/35 sm:bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Content placed directly over the background image */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 w-full text-center flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-theme-accent font-sans text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase font-semibold mb-2 sm:mb-4 block drop-shadow-sm"
          >
            FINE ARTIST &bull; CALLIGRAPHER &bull; IRELAND
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light tracking-widest uppercase leading-[1.05] text-warm-white select-none text-3xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-md"
          >
            ASMA SHALA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif uppercase tracking-[0.24em] sm:tracking-[0.28em] text-warm-white/90 mt-2 sm:mt-3 text-xs sm:text-base md:text-lg font-light drop-shadow-sm"
          >
            Art That Holds A Story
          </motion.p>

          {/* Action Buttons directly over background */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 mt-6 sm:mt-8 w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            <Magnetic range={30} strength={0.25}>
              <Button
                onClick={() => onNavigate('artwork')}
                variant="gold"
                className="w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-8 text-[9px] sm:text-[10px] tracking-[0.22em] shadow-lg"
              >
                EXPLORE EXHIBITION
              </Button>
            </Magnetic>

            <Magnetic range={30} strength={0.25}>
              <Button
                onClick={() => onNavigate('commissions')}
                variant="outline"
                className="w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-8 text-[9px] sm:text-[10px] tracking-[0.22em] text-warm-white border-warm-white/40 hover:border-warm-white bg-black/25 backdrop-blur-xs shadow-lg"
              >
                COMMISSION A PIECE
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* 2. THREE KEY ARTIST STATISTICS (Horizontally Aligned Directly Below Hero) */}
      <section className="py-8 sm:py-10 md:py-12 bg-theme-bg-surface border-b border-theme-border">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center sm:divide-x divide-theme-border">
            <div className="flex flex-col items-center justify-center">
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-theme-text tracking-wide">
                15+
              </span>
              <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-theme-text-muted mt-2 font-medium">
                Years Practice
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-theme-text tracking-wide">
                140+
              </span>
              <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-theme-text-muted mt-2 font-medium">
                Paintings Sold
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-theme-text tracking-wide">
                6
              </span>
              <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-theme-text-muted mt-2 font-medium">
                Countries
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED SELECTION / FEATURED CREATIONS CAROUSEL */}
      <section id="featured-creations" className="py-16 sm:py-20 md:py-28 bg-theme-bg text-theme-text">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header with Explore All Link */}
          <div className="flex justify-between items-end mb-8 sm:mb-10 text-left border-b border-theme-border pb-5 sm:pb-6">
            <div>
              <span className="text-[10px] font-sans tracking-[0.35em] text-theme-accent uppercase font-semibold block mb-1.5 sm:mb-2">
                CURATED SELECTION
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light uppercase tracking-widest text-theme-text">
                Featured Creations
              </h2>
            </div>

            <button
              onClick={() => onNavigate('artwork')}
              className="font-sans text-[10px] sm:text-xs tracking-[0.25em] uppercase text-theme-text-muted hover:text-theme-accent transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium shrink-0 pb-1"
            >
              <span>EXPLORE ALL</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Horizontal Artwork Carousel — Natural Momentum Swiping on Mobile */}
          <div
            ref={carouselRef}
            className="flex gap-5 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1 -mx-4 px-4 sm:-mx-2 sm:px-2 touch-pan-x"
            tabIndex={0}
          >
            {featuredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="w-[260px] sm:w-[320px] md:w-[350px] shrink-0 snap-start"
              >
                <ArtworkCard
                  artwork={artwork}
                  onSelect={onSelectArtwork}
                  onInquire={onInquire}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. GATEWAY EXHIBITION ROOMS SELECTOR (Exact Lily Portfolio layout) */}
      <section className="py-24 md:py-36 bg-theme-bg-surface border-t border-theme-border transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <span className="text-theme-accent font-sans text-[10px] tracking-[0.35em] uppercase font-semibold block mb-10">
            EXHIBITION ROOMS
          </span>

          <div className="flex flex-col gap-5 md:gap-7 font-serif text-xl sm:text-2xl md:text-3xl font-light uppercase tracking-widest text-theme-text transition-colors duration-500">
            <motion.div
              whileHover={{ x: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => onNavigate('artwork', 'Landscape & Realism')}
              className="border-b border-theme-border pb-5 flex justify-between items-center group cursor-pointer"
            >
              <span className="group-hover:text-theme-accent transition-colors">
                PAINTINGS &amp; REALISM ROOM
              </span>
              <ArrowRight
                size={18}
                className="opacity-30 group-hover:opacity-100 group-hover:text-theme-accent transition-all"
              />
            </motion.div>

            <motion.div
              whileHover={{ x: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => onNavigate('calligraphy')}
              className="border-b border-theme-border pb-5 flex justify-between items-center group cursor-pointer"
            >
              <span className="group-hover:text-theme-accent transition-colors">
                ARABIC CALLIGRAPHY GALLERY
              </span>
              <ArrowRight
                size={18}
                className="opacity-30 group-hover:opacity-100 group-hover:text-theme-accent transition-all"
              />
            </motion.div>

            <motion.div
              whileHover={{ x: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => onNavigate('previous-commissions')}
              className="border-b border-theme-border pb-5 flex justify-between items-center group cursor-pointer"
            >
              <span className="group-hover:text-theme-accent transition-colors">
                PREVIOUS COMMISSIONS ARCHIVE
              </span>
              <ArrowRight
                size={18}
                className="opacity-30 group-hover:opacity-100 group-hover:text-theme-accent transition-all"
              />
            </motion.div>

            <motion.div
              whileHover={{ x: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => onNavigate('commissions')}
              className="border-b border-theme-border pb-5 flex justify-between items-center group cursor-pointer"
            >
              <span className="group-hover:text-theme-accent transition-colors">
                COMMISSION PRICE GUIDE &amp; PROCESS
              </span>
              <ArrowRight
                size={18}
                className="opacity-30 group-hover:opacity-100 group-hover:text-theme-accent transition-all"
              />
            </motion.div>

            <motion.div
              whileHover={{ x: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => onNavigate('about')}
              className="pb-5 flex justify-between items-center group cursor-pointer"
            >
              <span className="group-hover:text-theme-accent transition-colors">
                ABOUT ASMA SHALA &amp; STORY
              </span>
              <ArrowRight
                size={18}
                className="opacity-30 group-hover:opacity-100 group-hover:text-theme-accent transition-all"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
