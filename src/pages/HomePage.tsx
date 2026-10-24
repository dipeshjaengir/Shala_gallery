import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ArtworkWithAsset, ARTWORKS_DATA } from '../data/artworks';
import { ArtworkCard } from '../components/ArtworkCard';
import { Button } from '../components/Button';
import { Magnetic } from '../components/Magnetic';

interface HomePageProps {
  onNavigate: (tab: string, categoryFilter?: string) => void;
  onSelectArtwork: (artwork: ArtworkWithAsset) => void;
  onInquire: (artwork: ArtworkWithAsset) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectArtwork,
  onInquire,
}) => {
  const featuredArtworks = ARTWORKS_DATA.filter((a) => a.featured);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 w-full overflow-hidden">
      {/* 1. FULL-SCREEN IMMERSIVE HERO SECTION */}
      <section className="relative min-h-[100dvh] h-[100dvh] w-full flex items-center justify-center overflow-hidden border-b border-theme-border">
        {/* Full-bleed background image covering the entire viewport */}
        <div className="absolute inset-0 z-0">
          <img
            src="/asma-calligraphy-hero.jpg"
            alt="Asma Shala creating Arabic calligraphy"
            className="w-full h-full object-cover object-[center_35%] sm:object-[center_30%]"
            loading="eager"
          />
          {/* Subtle dark vignette/overlay to ensure text readability while keeping Asma visually prominent */}
          <div className="absolute inset-0 bg-black/45 sm:bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
        </div>

        {/* Content placed directly over the background image */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 w-full text-center flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-theme-accent font-sans text-xs md:text-sm tracking-[0.4em] uppercase font-semibold mb-4 block drop-shadow-sm"
          >
            FINE ARTIST &bull; CALLIGRAPHER &bull; IRELAND
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light tracking-widest uppercase leading-[1.08] text-warm-white select-none text-4xl sm:text-6xl md:text-7xl drop-shadow-md"
          >
            ASMA SHALA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif italic lowercase text-warm-white/90 mt-3 text-xl sm:text-2xl md:text-3xl font-light tracking-wide drop-shadow-sm"
          >
            art that holds a story
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-warm-white/80 max-w-xl mx-auto mt-4 leading-relaxed drop-shadow-sm"
          >
            Original paintings &amp; Arabic calligraphy created to bring character and meaning into personal spaces.
          </motion.p>

          {/* Action Buttons directly over background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-10"
          >
            <Magnetic range={40} strength={0.3}>
              <Button
                onClick={() => onNavigate('artwork')}
                variant="gold"
                className="shadow-lg"
              >
                EXPLORE EXHIBITION
              </Button>
            </Magnetic>

            <Magnetic range={40} strength={0.3}>
              <Button
                onClick={() => onNavigate('commissions')}
                variant="outline"
                className="text-warm-white border-warm-white/40 hover:border-warm-white bg-black/20 backdrop-blur-xs shadow-lg"
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
      <section id="featured-creations" className="py-20 md:py-28 bg-theme-bg text-theme-text">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header with Carousel Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-left border-b border-theme-border pb-6 gap-4">
            <div>
              <span className="text-[10px] font-sans tracking-[0.35em] text-theme-accent uppercase font-semibold block mb-2">
                CURATED SELECTION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-widest text-theme-text">
                Featured Creations
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Previous & Next Carousel Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollPrev}
                  className="p-2.5 rounded-full border border-theme-border bg-theme-bg-card hover:bg-theme-text hover:text-theme-bg transition-colors cursor-pointer text-theme-text"
                  title="Scroll left"
                  aria-label="Previous paintings"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <button
                  onClick={scrollNext}
                  className="p-2.5 rounded-full border border-theme-border bg-theme-bg-card hover:bg-theme-text hover:text-theme-bg transition-colors cursor-pointer text-theme-text"
                  title="Scroll right"
                  aria-label="Next paintings"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </div>

              <button
                onClick={() => onNavigate('artwork')}
                className="font-sans text-[10px] tracking-[0.25em] uppercase text-theme-text-muted hover:text-theme-accent transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium ml-2"
              >
                <span>EXPLORE ALL</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Horizontal Artwork Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1 -mx-2 px-2"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') scrollPrev();
              if (e.key === 'ArrowRight') scrollNext();
            }}
          >
            {featuredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start"
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
