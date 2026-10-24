import React, { useState } from 'react';
import { ArtworkWithAsset } from '../data/artworks';

interface ArtworkVisualProps {
  artwork: ArtworkWithAsset;
  className?: string;
  showFraming?: boolean;
  priority?: boolean;
}

export const ArtworkVisual: React.FC<ArtworkVisualProps> = ({
  artwork,
  className = '',
  showFraming = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const isDark = false;

  const hasRealImage = artwork.imageSrc && !imageError;

  const aspectClass =
    artwork.aspectRatio === 'portrait' ? 'aspect-[3/4]' :
    artwork.aspectRatio === 'landscape' ? 'aspect-[4/3]' :
    artwork.aspectRatio === 'tall' ? 'aspect-[2/3]' :
    'aspect-square';

  if (hasRealImage) {
    return (
      <div className={`relative overflow-hidden bg-theme-bg-surface flex items-center justify-center ${showFraming ? 'max-h-[60vh] w-auto' : aspectClass} ${className}`}>
        <img
          src={artwork.imageSrc}
          alt={`${artwork.title} — ${artwork.medium} by Asma Shala`}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-1 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  // Museum Digital Canvas Presentation aligned with Lily's aesthetic
  const isCalligraphy = artwork.category === 'Arabic Calligraphy';

  return (
    <div
      className={`relative overflow-hidden select-none flex flex-col justify-between p-6 sm:p-7 transition-all duration-700 ease-out group-hover:scale-[1.015] ${aspectClass} ${className} ${
        showFraming ? 'border-4 border-theme-border-medium shadow-inner' : ''
      }`}
      style={{
        backgroundColor: isDark ? '#121215' : '#F4F1EA',
        backgroundImage: isCalligraphy
          ? isDark
            ? `radial-gradient(ellipse at 70% 30%, rgba(197, 168, 110, 0.22) 0%, transparent 65%), radial-gradient(ellipse at 30% 75%, rgba(140, 123, 80, 0.18) 0%, transparent 55%)`
            : `radial-gradient(ellipse at 70% 30%, rgba(197, 168, 110, 0.2) 0%, transparent 60%)`
          : isDark
          ? `radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.45) 100%)`
          : `radial-gradient(ellipse at 50% 35%, rgba(255, 255, 255, 0.6) 0%, rgba(0, 0, 0, 0.08) 100%)`,
      }}
    >
      {/* Texture grain */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 0)`,
          backgroundSize: '4px 4px',
        }}
      />

      {/* Top Registry Mark */}
      <div className="relative z-10 flex items-center justify-between text-[8px] uppercase tracking-[0.25em] text-theme-text-muted opacity-60 font-sans">
        <span>SHALAGALLERY</span>
        <span>{artwork.dimensions}</span>
      </div>

      {/* Center Artistic Emblem */}
      {isCalligraphy ? (
        <div className="relative z-10 my-auto text-center px-4">
          <div className="inline-block mx-auto mb-3 transition-transform duration-700 group-hover:scale-105">
            <svg viewBox="0 0 160 160" className="w-20 h-20 sm:w-24 sm:h-24 mx-auto drop-shadow-md">
              <circle cx="80" cy="80" r="74" fill="none" stroke="#C5A86E" strokeWidth="1" strokeDasharray="3 4" opacity="0.6"/>
              <circle cx="80" cy="80" r="66" fill="none" stroke="#C5A86E" strokeWidth="0.75" opacity="0.3"/>
              
              <path
                d="M 45 95 C 50 65, 75 40, 115 50 C 95 65, 80 85, 70 120 C 65 105, 55 98, 45 95 Z"
                fill="#C5A86E"
                opacity="0.9"
              />
              <path
                d="M 68 75 C 85 68, 105 72, 125 90 C 110 95, 90 92, 78 86 Z"
                fill={isDark ? '#FAF9F6' : '#24231F'}
                opacity="0.8"
              />
              <circle cx="118" cy="45" r="3" fill="#C5A86E" />
              <circle cx="126" cy="55" r="2.5" fill="#C5A86E" />
            </svg>
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-theme-accent font-semibold font-sans">
            Arabic Calligraphy
          </div>
        </div>
      ) : artwork.category === 'Abstract Art' ? (
        <div className="relative z-10 my-auto px-4 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 border border-theme-border rounded-full flex items-center justify-center p-2 opacity-80 group-hover:scale-105 transition-transform duration-700">
            <div className="w-8 h-8 rounded-full bg-theme-accent/30 blur-[1px]" />
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-theme-accent font-semibold font-sans">
            Abstract Art
          </div>
        </div>
      ) : (
        <div className="relative z-10 my-auto px-4 text-center">
          <div className="w-20 h-14 sm:w-24 sm:h-16 mx-auto mb-3 border-t border-b border-theme-border flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-700">
            <div className="w-2 h-2 rounded-full bg-theme-accent" />
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-theme-accent font-semibold font-sans">
            {artwork.category === 'Previous Commissions' ? 'Commissioned Study' : 'Original Oil Painting'}
          </div>
        </div>
      )}

      {/* Bottom Corner Details */}
      <div className="relative z-10 flex items-center justify-between border-t border-theme-border pt-2 text-[8px] uppercase tracking-[0.22em] text-theme-text-muted font-sans">
        <span>Asma Shala</span>
        <span className="text-theme-accent">Ireland</span>
      </div>
    </div>
  );
};
