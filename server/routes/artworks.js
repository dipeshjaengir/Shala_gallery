import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Artwork } from '../models/Artwork.js';
import { requireAdmin } from '../middleware/auth.js';
import { uploadArtworkStream, deleteArtworkAsset } from '../config/cloudinary.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mappingFilePath = path.resolve(__dirname, '../data/cloudinary-artwork-mapping.json');

const ORIGINAL_ARTWORK_ORDER_MAP = {
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
  // Previous Commissions - Scenic (9 pieces)
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
  // Previous Commissions - Islamic-Inspired (5 pieces)
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

function getOriginalArtworkRank(art) {
  const idKey = (art.id || (art._id ? art._id.toString() : '')).toLowerCase().trim();
  if (ORIGINAL_ARTWORK_ORDER_MAP[idKey] !== undefined) {
    return ORIGINAL_ARTWORK_ORDER_MAP[idKey];
  }
  const titleKey = (art.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (ORIGINAL_ARTWORK_ORDER_MAP[titleKey] !== undefined) {
    return ORIGINAL_ARTWORK_ORDER_MAP[titleKey];
  }
  const plainTitle = (art.title || '').toLowerCase().trim();
  if (ORIGINAL_ARTWORK_ORDER_MAP[plainTitle] !== undefined) {
    return ORIGINAL_ARTWORK_ORDER_MAP[plainTitle];
  }
  return null;
}

function sortArtworksCanonical(artworks) {
  const newlyAdded = [];
  const originals = [];

  for (const art of artworks) {
    const rank = getOriginalArtworkRank(art);
    if (rank !== null) {
      originals.push({ art, rank });
    } else {
      newlyAdded.push(art);
    }
  }

  // Newly added artwork comes first (newest first)
  newlyAdded.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (timeA !== timeB) return timeB - timeA;
    return (a.title || '').localeCompare(b.title || '');
  });

  // Original artworks maintain their exact previous order
  originals.sort((a, b) => a.rank - b.rank);

  return [...newlyAdded, ...originals.map((item) => item.art)];
}

const getFallbackArtworks = () => {
  if (fs.existsSync(mappingFilePath)) {
    try {
      const mapping = JSON.parse(fs.readFileSync(mappingFilePath, 'utf8'));
      return Object.values(mapping)
        .filter((item) => item.category !== 'Artist Photography')
        .map((item, index) => ({
          _id: item.id,
          id: item.id,
          title: item.title,
          category: item.category,
          medium: item.medium || 'Fine Art',
          dimensions: item.dimensions || '',
          price: item.price || null,
          framing: item.framing || 'Unframed',
          status: item.status || 'available',
          year: new Date().getFullYear().toString(),
          description: item.description || '',
          aspectRatio: item.aspectRatio || 'portrait',
          featured: Boolean(item.featured),
          order: index + 1,
          imageSrc: item.secure_url,
          cloudinaryPublicId: item.public_id,
          commissionSubtype: item.commissionSubtype || null,
        }));
    } catch (e) {
      return [];
    }
  }
  return [];
};

// Configure Multer for secure memory buffer uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Allowed formats: JPEG, PNG, WebP.'));
    }
  },
});

// GET /api/artworks - Public: Retrieve all artworks
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const artworks = await Artwork.find();
      if (artworks && artworks.length > 0) {
        const sorted = sortArtworksCanonical(artworks);
        return res.json({
          status: 'ok',
          count: sorted.length,
          data: sorted,
        });
      }
    }
    const fallbacks = getFallbackArtworks();
    const sortedFallbacks = sortArtworksCanonical(fallbacks);
    res.json({
      status: 'ok',
      count: sortedFallbacks.length,
      data: sortedFallbacks,
    });
  } catch (error) {
    const fallbacks = getFallbackArtworks();
    const sortedFallbacks = sortArtworksCanonical(fallbacks);
    res.json({
      status: 'ok',
      count: sortedFallbacks.length,
      data: sortedFallbacks,
    });
  }
});

// GET /api/artworks/:id - Public: Retrieve single artwork
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ status: 'error', message: 'Artwork not found.' });
    }
    res.json({ status: 'ok', data: artwork });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve artwork.' });
  }
});

// POST /api/artworks - Protected (Admin): Create artwork with optional Cloudinary upload
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      category,
      medium,
      dimensions,
      price,
      framing,
      status,
      year,
      description,
      aspectRatio,
      featured,
      commissionSubtype,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ status: 'error', message: 'Title is required.' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ status: 'error', message: 'Category is required.' });
    }

    let imageSrc = req.body.imageSrc;
    let cloudinaryPublicId = null;

    // Handle Cloudinary upload if a binary file was submitted
    if (req.file) {
      const uploadResult = await uploadArtworkStream(req.file.buffer, title.trim());
      imageSrc = uploadResult.secure_url;
      cloudinaryPublicId = uploadResult.public_id;
    }

    if (!imageSrc) {
      return res.status(400).json({
        status: 'error',
        message: 'Please choose an image file for this artwork.',
      });
    }

    let orderNum = Number(req.body.order);
    if (isNaN(orderNum) || orderNum <= 0) {
      const highest = await Artwork.findOne({ order: { $lt: 900 } }).sort({ order: -1 }).select('order');
      orderNum = highest && typeof highest.order === 'number' ? highest.order + 1 : 23;
    }

    const artwork = await Artwork.create({
      title: title.trim(),
      category: category.trim(),
      medium: (medium || '').trim(),
      dimensions: (dimensions || '').trim(),
      price: price ? price.trim() : null,
      framing: (framing || 'Unframed').trim(),
      status: status || 'available',
      year: year ? year.trim() : new Date().getFullYear().toString(),
      description: (description || '').trim(),
      aspectRatio: aspectRatio || 'portrait',
      featured: featured === true || featured === 'true',
      order: orderNum,
      imageSrc,
      cloudinaryPublicId,
      commissionSubtype: commissionSubtype ? commissionSubtype.trim() : null,
    });

    console.log(`[Artworks] Created artwork record: ${artwork.title} (ID: ${artwork._id})`);

    res.status(201).json({
      status: 'ok',
      message: 'Artwork created successfully.',
      data: artwork,
    });
  } catch (error) {
    console.error('[Artwork Creation Error]', error.message);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to create artwork.' });
  }
});

// PUT /api/artworks/:id - Protected (Admin): Update artwork
router.put('/:id', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ status: 'error', message: 'Artwork not found.' });
    }

    const updates = { ...req.body };

    // If new image file is uploaded, upload to Cloudinary and clean up previous Cloudinary asset
    if (req.file) {
      const uploadResult = await uploadArtworkStream(req.file.buffer, artwork.title);
      const oldPublicId = artwork.cloudinaryPublicId;

      updates.imageSrc = uploadResult.secure_url;
      updates.cloudinaryPublicId = uploadResult.public_id;

      if (oldPublicId) {
        await deleteArtworkAsset(oldPublicId);
      }
    }

    if (updates.featured !== undefined) {
      updates.featured = updates.featured === true || updates.featured === 'true';
    }

    if (updates.order !== undefined) {
      const parsedOrder = Number(updates.order);
      if (!isNaN(parsedOrder) && parsedOrder > 0) {
        updates.order = parsedOrder;
      }
    }

    Object.assign(artwork, updates);
    await artwork.save();

    console.log(`[Artworks] Updated artwork record: ${artwork.title}`);

    res.json({
      status: 'ok',
      message: 'Artwork updated successfully.',
      data: artwork,
    });
  } catch (error) {
    console.error('[Artwork Update Error]', error.message);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update artwork.' });
  }
});

// DELETE /api/artworks/:id - Protected (Admin): Delete artwork and associated Cloudinary asset
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ status: 'error', message: 'Artwork not found.' });
    }

    // Safely delete Cloudinary image if it exists
    if (artwork.cloudinaryPublicId) {
      await deleteArtworkAsset(artwork.cloudinaryPublicId);
    }

    await Artwork.findByIdAndDelete(req.params.id);
    console.log(`[Artworks] Deleted artwork record: ${artwork.title}`);

    res.json({
      status: 'ok',
      message: 'Artwork and associated assets deleted successfully.',
    });
  } catch (error) {
    console.error('[Artwork Deletion Error]', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to delete artwork.' });
  }
});

export default router;
