import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cloudinary from '../config/cloudinary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Genuine artwork definitions matching src/data/artworks.ts
const ARTWORKS_METADATA = [
  {
    id: 'memories',
    title: 'Memories',
    category: 'Landscape & Realism',
    dimensions: '70 × 50 cm',
    price: '€1,800',
    framing: 'Unframed',
    status: 'available',
    aspectRatio: 'portrait',
    featured: true,
    localFile: 'public/artworks/memories.png',
    description: 'Original landscape painting capturing atmosphere and memory.',
  },
  {
    id: 'rebirth',
    title: 'Rebirth',
    category: 'Landscape & Realism',
    dimensions: '49 × 40 cm',
    price: '€560',
    framing: 'Unframed',
    status: 'available',
    aspectRatio: 'portrait',
    featured: true,
    localFile: 'public/artworks/rebirth.png',
    description: 'Mountain landscape exploring atmospheric depth and organic texture.',
  },
  {
    id: 'nostalgia',
    title: 'Nostalgia',
    category: 'Landscape & Realism',
    dimensions: '70 × 50 cm',
    price: '€2,000',
    framing: 'Unframed',
    status: 'available',
    aspectRatio: 'landscape',
    featured: true,
    localFile: 'public/artworks/nostalgia.png',
    description: 'Expansive mountain valley landscape with warm earth tones.',
  },
  {
    id: 'the-depths',
    title: 'The Depths',
    category: 'Landscape & Realism',
    dimensions: '42 × 32 cm (including frame)',
    price: '€250',
    framing: 'Framed',
    status: 'available',
    aspectRatio: 'portrait',
    featured: true,
    localFile: 'public/artworks/the-depths.png',
    description: 'Forest and foliage landscape in archival frame.',
  },
  {
    id: 'the-wild',
    title: 'The Wild',
    category: 'Landscape & Realism',
    dimensions: '35 × 28 cm',
    price: '€260',
    framing: 'Unframed',
    status: 'available',
    aspectRatio: 'portrait',
    featured: true,
    localFile: 'public/artworks/the-wild.png',
    description: 'Mountain vista on canvas.',
  },
  {
    id: 'arabic-calligraphy-1',
    title: 'Arabic Calligraphy I',
    category: 'Arabic Calligraphy',
    dimensions: 'Custom archival scale',
    price: 'P.O.R.',
    framing: 'Framed',
    status: 'available',
    aspectRatio: 'portrait',
    featured: true,
    localFile: 'public/artworks/calligraphy-1.png',
    description: 'Original Arabic calligraphy hand-lettered by Asma Shala.',
  },
  {
    id: 'arabic-calligraphy-2',
    title: 'Arabic Calligraphy II',
    category: 'Arabic Calligraphy',
    dimensions: 'Custom archival scale',
    price: 'P.O.R.',
    framing: 'Unframed',
    status: 'available',
    aspectRatio: 'landscape',
    featured: true,
    localFile: 'public/artworks/calligraphy-2.png',
    description: 'Original Arabic calligraphy on bespoke ground.',
  },
  {
    id: 'commission-1',
    title: 'Commission I',
    category: 'Previous Commissions',
    commissionSubtype: 'Landscapes & Nature',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'portrait',
    featured: false,
    localFile: 'public/artworks/commission-1.png',
    description: 'Bespoke landscape commission for private residence.',
  },
  {
    id: 'commission-2',
    title: 'Commission II',
    category: 'Previous Commissions',
    commissionSubtype: 'Landscapes & Nature',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/commission-2.png',
    description: 'Bespoke sunset landscape commission.',
  },
  {
    id: 'commission-3',
    title: 'Commission III',
    category: 'Previous Commissions',
    commissionSubtype: 'Landscapes & Nature',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/commission-3.png',
    description: 'Atmospheric coastal commission.',
  },
  {
    id: 'commission-4',
    title: 'Commission IV',
    category: 'Previous Commissions',
    commissionSubtype: 'Landscapes & Nature',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'portrait',
    featured: false,
    localFile: 'public/artworks/commission-4.png',
    description: 'Monochromatic mountain commission.',
  },
  {
    id: 'commission-5',
    title: 'Commission V',
    category: 'Previous Commissions',
    commissionSubtype: 'Landscapes & Nature',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/commission-5.png',
    description: 'Atmospheric landscape commission.',
  },
  {
    id: 'commission-6',
    title: 'Commission VI',
    category: 'Previous Commissions',
    commissionSubtype: 'Landscapes & Nature',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/commission-6.png',
    description: 'Scenic Irish landscape commission.',
  },
  {
    id: 'commission-7',
    title: 'Commission VII',
    category: 'Previous Commissions',
    commissionSubtype: 'Landscapes & Nature',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/commission-7.png',
    description: 'Coastal sea cliff commission.',
  },
  {
    id: 'commission-8',
    title: 'Commission VIII',
    category: 'Previous Commissions',
    commissionSubtype: 'Landscapes & Nature',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/commission-8.png',
    description: 'Bespoke sunset over hills commission.',
  },
  {
    id: 'commission-9',
    title: 'Commission IX',
    category: 'Previous Commissions',
    commissionSubtype: 'Landscapes & Nature',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/commission-9.png',
    description: 'Warm valley landscape commission.',
  },
  {
    id: 'islamic-commission-1',
    title: 'Islamic-Inspired Commission I',
    category: 'Previous Commissions',
    commissionSubtype: 'Islamic-Inspired',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'portrait',
    featured: false,
    localFile: 'public/artworks/islamic-commission-1.png',
    description: 'Islamic-inspired architectural commission.',
  },
  {
    id: 'islamic-commission-2',
    title: 'Islamic-Inspired Commission II',
    category: 'Previous Commissions',
    commissionSubtype: 'Islamic-Inspired',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/islamic-commission-2.png',
    description: 'Islamic-inspired mosque architecture commission.',
  },
  {
    id: 'islamic-commission-3',
    title: 'Islamic-Inspired Commission III',
    category: 'Previous Commissions',
    commissionSubtype: 'Islamic-Inspired',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/islamic-commission-3.png',
    description: 'Islamic-inspired minaret and courtyard commission.',
  },
  {
    id: 'islamic-commission-4',
    title: 'Islamic-Inspired Commission IV',
    category: 'Previous Commissions',
    commissionSubtype: 'Islamic-Inspired',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/islamic-commission-4.png',
    description: 'Islamic-inspired historic architecture commission.',
  },
  {
    id: 'islamic-commission-5',
    title: 'Islamic-Inspired Commission V',
    category: 'Previous Commissions',
    commissionSubtype: 'Islamic-Inspired',
    medium: 'Bespoke Commission',
    dimensions: 'Custom scale',
    price: null,
    status: 'commissioned',
    aspectRatio: 'landscape',
    featured: false,
    localFile: 'public/artworks/islamic-commission-5.png',
    description: 'Islamic-inspired landscape and architecture commission.',
  },
  // Key Artist Photography Assets
  {
    id: 'artist-photo-calligraphy-hero',
    title: 'Asma Creating Arabic Calligraphy',
    category: 'Artist Photography',
    status: 'available',
    aspectRatio: 'landscape',
    featured: true,
    localFile: 'public/asma-calligraphy-hero.jpg',
    description: 'Hero photograph of Asma Shala creating Arabic calligraphy at her work table.',
  },
  {
    id: 'artist-photo-portrait-landscape',
    title: 'Asma with Landscape Painting',
    category: 'Artist Photography',
    status: 'available',
    aspectRatio: 'portrait',
    featured: true,
    localFile: 'public/asma-portrait-landscape.jpg',
    description: 'About page photograph of Asma Shala holding her fine landscape painting.',
  },
];

async function runUpload() {
  console.log('===============================================================');
  console.log('SHALAGALLERY CLOUDINARY ARTWORK MIGRATION');
  console.log('Target Cloud: ieyxmxrp | Folder: shala_gallery');
  console.log('===============================================================');

  // Verify Cloudinary configuration
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'ieyxmxrp';
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret || apiKey.includes('REPLACE') || apiSecret.includes('REPLACE')) {
    console.error('Error: Cloudinary credentials missing or contain placeholders in .env.');
    process.exit(1);
  }

  // Load existing mapping if present
  const dataDir = path.resolve(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const mappingFilePath = path.join(dataDir, 'cloudinary-artwork-mapping.json');
  let mapping = {};
  if (fs.existsSync(mappingFilePath)) {
    try {
      mapping = JSON.parse(fs.readFileSync(mappingFilePath, 'utf8'));
    } catch (e) {
      mapping = {};
    }
  }

  let totalFound = ARTWORKS_METADATA.length;
  let successCount = 0;
  let alreadyCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  for (const item of ARTWORKS_METADATA) {
    const fullLocalPath = path.join(projectRoot, item.localFile);

    if (!fs.existsSync(fullLocalPath)) {
      console.warn(`[SKIP] File not found: ${item.localFile}`);
      skippedCount++;
      continue;
    }

    // Check if already in mapping and verified on Cloudinary
    if (mapping[item.id] && mapping[item.id].secure_url) {
      console.log(`[EXISTS] ${item.id} already uploaded: ${mapping[item.id].public_id}`);
      alreadyCount++;
      continue;
    }

    try {
      console.log(`[UPLOADING] ${item.title} (${item.localFile})...`);
      const publicId = `shala_gallery/${item.id}`;

      const uploadResult = await cloudinary.uploader.upload(fullLocalPath, {
        public_id: publicId,
        folder: 'shala_gallery',
        overwrite: true,
        resource_type: 'image',
        tags: ['shalagallery', item.category.toLowerCase().replace(/[^a-z0-9]/g, '_')],
      });

      mapping[item.id] = {
        id: item.id,
        title: item.title,
        category: item.category,
        commissionSubtype: item.commissionSubtype || null,
        dimensions: item.dimensions,
        price: item.price,
        framing: item.framing,
        status: item.status,
        aspectRatio: item.aspectRatio,
        featured: item.featured,
        description: item.description,
        localFile: item.localFile,
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        uploadedAt: new Date().toISOString(),
      };

      console.log(`[SUCCESS] ${item.title} -> ${uploadResult.secure_url}`);
      successCount++;
    } catch (err) {
      console.error(`[FAIL] ${item.title}: ${err.message}`);
      failedCount++;
    }
  }

  // Save mapping file
  fs.writeFileSync(mappingFilePath, JSON.stringify(mapping, null, 2), 'utf8');

  console.log('===============================================================');
  console.log('IMAGE MIGRATION REPORT');
  console.log('===============================================================');
  console.log(`Total Image Assets Found:     ${totalFound}`);
  console.log(`Successfully Uploaded Now:    ${successCount}`);
  console.log(`Already Uploaded Previously:  ${alreadyCount}`);
  console.log(`Failed Uploads:               ${failedCount}`);
  console.log(`Skipped (Missing Local File): ${skippedCount}`);
  console.log(`Mapping Record Saved:         ${mappingFilePath}`);
  console.log('===============================================================');
}

runUpload();
