import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ArtworkWithAsset, ARTWORKS_DATA } from '../data/artworks';
import { apiFetch } from '../utils/api';

export interface ArtworksContextType {
  artworks: ArtworkWithAsset[];
  loading: boolean;
  error: string | null;
  refreshArtworks: () => Promise<void>;
}

// Canonical ranking of the 21 original SHALAGALLERY artworks
export const ORIGINAL_ARTWORK_ORDER_MAP: Record<string, number> = {
  // 5 Original Available Paintings
  'memories': 1,
  'rebirth': 2,
  'nostalgia': 3,
  'the-depths': 4,
  'the depths': 4,
  'the-wild': 5,
  'the wild': 5,
  // Arabic Calligraphy (2 authentic pieces)
  'arabic-calligraphy-1': 6,
  'arabic-calligraphy-i': 6,
  'arabic calligraphy i': 6,
  'arabic-calligraphy-2': 7,
  'arabic-calligraphy-ii': 7,
  'arabic calligraphy ii': 7,
  // Scenic & Landscape Previous Commissions (9 pieces)
  'commission-1': 8,
  'commission-i': 8,
  'commission i': 8,
  'commission-2': 9,
  'commission-ii': 9,
  'commission ii': 9,
  'commission-3': 10,
  'commission-iii': 10,
  'commission iii': 10,
  'commission-4': 11,
  'commission-iv': 11,
  'commission iv': 11,
  'commission-5': 12,
  'commission-v': 12,
  'commission v': 12,
  'commission-6': 13,
  'commission-vi': 13,
  'commission vi': 13,
  'commission-7': 14,
  'commission-vii': 14,
  'commission vii': 14,
  'commission-8': 15,
  'commission-viii': 15,
  'commission viii': 15,
  'commission-9': 16,
  'commission-ix': 16,
  'commission ix': 16,
  // Islamic-Inspired Previous Commissions (5 pieces)
  'islamic-commission-1': 17,
  'islamic-commission-i': 17,
  'islamic-inspired-commission-1': 17,
  'islamic-inspired-commission-i': 17,
  'islamic-inspired commission i': 17,
  'islamic-commission-2': 18,
  'islamic-commission-ii': 18,
  'islamic-inspired-commission-2': 18,
  'islamic-inspired-commission-ii': 18,
  'islamic-inspired commission ii': 18,
  'islamic-commission-3': 19,
  'islamic-commission-iii': 19,
  'islamic-inspired-commission-3': 19,
  'islamic-inspired-commission-iii': 19,
  'islamic-inspired commission iii': 19,
  'islamic-commission-4': 20,
  'islamic-commission-iv': 20,
  'islamic-inspired-commission-4': 20,
  'islamic-inspired-commission-iv': 20,
  'islamic-inspired commission iv': 20,
  'islamic-commission-5': 21,
  'islamic-commission-v': 21,
  'islamic-inspired-commission-5': 21,
  'islamic-inspired-commission-v': 21,
  'islamic-inspired commission v': 21,
};

export function getOriginalArtworkRank(artwork: { id?: string; title?: string }): number | null {
  const idKey = (artwork.id || '').toLowerCase().trim();
  if (ORIGINAL_ARTWORK_ORDER_MAP[idKey] !== undefined) {
    return ORIGINAL_ARTWORK_ORDER_MAP[idKey];
  }
  const titleKey = (artwork.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (ORIGINAL_ARTWORK_ORDER_MAP[titleKey] !== undefined) {
    return ORIGINAL_ARTWORK_ORDER_MAP[titleKey];
  }
  const plainTitle = (artwork.title || '').toLowerCase().trim();
  if (ORIGINAL_ARTWORK_ORDER_MAP[plainTitle] !== undefined) {
    return ORIGINAL_ARTWORK_ORDER_MAP[plainTitle];
  }
  return null;
}

export function sortArtworksInCanonicalOrder(artworks: ArtworkWithAsset[]): ArtworkWithAsset[] {
  const newlyAdded: ArtworkWithAsset[] = [];
  const originals: { artwork: ArtworkWithAsset; rank: number }[] = [];

  for (const art of artworks) {
    const rank = getOriginalArtworkRank(art);
    if (rank !== null) {
      originals.push({ artwork: art, rank });
    } else {
      newlyAdded.push(art);
    }
  }

  // Newly added artwork should come first (newest first)
  newlyAdded.sort((a, b) => {
    const timeA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
    const timeB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
    if (timeA !== timeB) return timeB - timeA;
    return (a.title || '').localeCompare(b.title || '');
  });

  // Original collection retains exact previous order (1 to 21)
  originals.sort((a, b) => a.rank - b.rank);

  return [...newlyAdded, ...originals.map((item) => item.artwork)];
}

export function mapMongoArtwork(item: any): ArtworkWithAsset {
  return {
    id: String(item.id || item._id || item.title?.toLowerCase().replace(/\s+/g, '-')),
    title: item.title || 'Untitled',
    category: item.category || 'Landscape & Realism',
    medium: item.medium || 'Fine Art Original',
    dimensions: item.dimensions || '',
    price: item.price !== undefined ? item.price : null,
    framing: item.framing || 'Unframed',
    status: item.status || 'available',
    year: item.year ? String(item.year) : new Date().getFullYear().toString(),
    description: item.description || '',
    aspectRatio: (item.aspectRatio as any) || 'portrait',
    featured: Boolean(item.featured),
    order: typeof item.order === 'number' ? item.order : undefined,
    commissionSubtype: item.commissionSubtype || undefined,
    imageSrc: item.imageSrc || '',
    artistPhotoSrc: item.artistPhotoSrc || undefined,
    createdAt: item.createdAt,
    visualStyle: item.visualStyle && item.visualStyle.baseTone ? item.visualStyle : {
      baseTone: '#8A7A68',
      accentTone: '#C5A86E',
      atmosphere: 'Fine Art Studio Piece',
      textureType: 'canvas',
    },
  } as ArtworkWithAsset & { createdAt?: string };
}

const ArtworksContext = createContext<ArtworksContextType>({
  artworks: sortArtworksInCanonicalOrder(ARTWORKS_DATA),
  loading: false,
  error: null,
  refreshArtworks: async () => {},
});

export const ArtworksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artworks, setArtworks] = useState<ArtworkWithAsset[]>(() => sortArtworksInCanonicalOrder(ARTWORKS_DATA));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/artworks');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json && json.status === 'ok' && Array.isArray(json.data) && json.data.length > 0) {
        const mapped = json.data.map(mapMongoArtwork);
        setArtworks(sortArtworksInCanonicalOrder(mapped));
        setError(null);
      }
    } catch (err: any) {
      console.warn('Could not fetch dynamic artworks, keeping current/fallback data:', err?.message);
      setError(err?.message || 'Failed to load artworks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks();

    const handleUpdate = () => {
      fetchArtworks();
    };

    window.addEventListener('shalagallery-artworks-updated', handleUpdate);
    return () => window.removeEventListener('shalagallery-artworks-updated', handleUpdate);
  }, [fetchArtworks]);

  return (
    <ArtworksContext.Provider value={{ artworks, loading, error, refreshArtworks: fetchArtworks }}>
      {children}
    </ArtworksContext.Provider>
  );
};

export const useArtworks = (): ArtworksContextType => {
  const context = useContext(ArtworksContext);
  return context || {
    artworks: sortArtworksInCanonicalOrder(ARTWORKS_DATA),
    loading: false,
    error: null,
    refreshArtworks: async () => {},
  };
};
