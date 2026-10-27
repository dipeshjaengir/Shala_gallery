export type ArtworkCategory = 
  | 'Landscape & Realism'
  | 'Abstract Art'
  | 'Arabic Calligraphy'
  | 'Previous Commissions';

export type ArtworkStatus = 'available' | 'sold' | 'commissioned' | 'private_collection';

export interface Artwork {
  id: string;
  title: string;
  category: ArtworkCategory;
  medium?: string;
  dimensions?: string;
  price?: string | null;
  framing?: 'Framed' | 'Unframed' | string;
  status: ArtworkStatus;
  year?: string;
  description?: string;
  aspectRatio: 'landscape' | 'portrait' | 'square' | 'tall';
  featured: boolean;
  order?: number;
  commissionSubtype?: 'Islamic-Inspired' | 'Landscapes & Nature' | string;
  imagePlaceholderNote?: string;
  // Visual artwork presentation parameters
  visualStyle: {
    baseTone: string;
    accentTone: string;
    atmosphere: string;
    textureType: 'canvas' | 'linen' | 'parchment' | 'gold_leaf';
  };
}

export interface CommissionPriceTier {
  sizeCode: string;
  dimensions: string;
  price: string;
  suitableFor: string;
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  inquiryType: 'Existing Artwork' | 'Custom Commission' | 'Arabic Calligraphy' | 'Interior Design Collaboration' | 'Other';
  artworkTitle?: string;
  dimensions?: string;
  budgetRange?: string;
  message: string;
}
