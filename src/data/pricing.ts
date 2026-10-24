import { CommissionPriceTier } from '../types/artwork';

export const COMMISSION_PRICE_TIERS: CommissionPriceTier[] = [
  {
    sizeCode: 'A5',
    dimensions: '14.8 × 21 cm',
    price: '€75',
    suitableFor: 'Intimate spaces, bedside or personal study vignettes',
  },
  {
    sizeCode: 'A4',
    dimensions: '21 × 29.7 cm',
    price: '€145',
    suitableFor: 'Framed gallery walls, reading nooks, and accent shelving',
  },
  {
    sizeCode: 'A3',
    dimensions: '29.7 × 42 cm',
    price: '€285',
    suitableFor: 'Foyer displays, bedroom suites, and console table styling',
  },
  {
    sizeCode: 'A2',
    dimensions: '42 × 59.4 cm',
    price: '€450',
    suitableFor: 'Dining areas, living room pairings, and statement office walls',
  },
  {
    sizeCode: 'A1',
    dimensions: '59.4 × 84.1 cm',
    price: '€640',
    suitableFor: 'Large living spaces, reception rooms, and architectural recesses',
  },
  {
    sizeCode: 'A0',
    dimensions: '84.1 × 118.9 cm',
    price: '€900',
    suitableFor: 'Feature walls, double-height ceilings, and grand living spaces',
  },
  {
    sizeCode: 'Larger',
    dimensions: 'Custom / 120+ cm',
    price: '€1,000+',
    suitableFor: 'Expansive bespoke residential installations & panoramic interior commissions',
  },
];

export const COMMISSION_STEPS = [
  {
    step: '01',
    title: 'The Conversation',
    subtitle: 'Vision & Space',
    description:
      'Asma discusses colour, scale, mood, the intended space, and any personal story, memory, or feeling the client would like the artwork to represent.',
  },
  {
    step: '02',
    title: 'Creative Alignment',
    subtitle: 'Artistic Voice',
    description:
      'Asma considers whether the proposed piece aligns with her creative direction. The purpose is to ensure that the final artwork remains authentic to her artistic voice.',
  },
  {
    step: '03',
    title: 'Quote and Timeline',
    subtitle: 'Transparent Scope',
    description:
      'Once both parties are aligned, Asma shares an estimated price and timeline before the work begins. Every timeline is tailored to the project scale and drying requirements.',
  },
  {
    step: '04',
    title: 'Creating the Piece',
    subtitle: 'Care & Milestones',
    description:
      'Asma develops the artwork with care and may check in with the client at agreed milestones, sharing updates as the layers and textures take shape.',
  },
  {
    step: '05',
    title: 'Completion and Delivery',
    subtitle: 'Hand-Finished Care',
    description:
      'Final approval, professional framing options, packaging, and delivery arrangements are discussed individually to ensure the artwork arrives safely in your home.',
  },
];
