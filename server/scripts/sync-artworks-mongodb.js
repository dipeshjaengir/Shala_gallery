import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Artwork } from '../models/Artwork.js';
import { DB_NAME } from '../config/db.js';
import { getEnv, validateMongoUri } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mappingFilePath = path.resolve(__dirname, '../data/cloudinary-artwork-mapping.json');

async function syncArtworksToMongo() {
  console.log('===============================================================');
  console.log('SHALAGALLERY MONGODB ARTWORK SYNC');
  console.log(`Target Database: ${DB_NAME}`);
  console.log('===============================================================');

  const { MONGODB_URI } = getEnv();
  const validation = validateMongoUri(MONGODB_URI);

  if (!validation.isValid) {
    console.error(`Error: ${validation.reason}`);
    process.exit(1);
  }

  if (!fs.existsSync(mappingFilePath)) {
    console.error(`Error: Cloudinary mapping file not found at ${mappingFilePath}. Run upload-artwork-images.js first.`);
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(mappingFilePath, 'utf8'));

  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME, serverSelectionTimeoutMS: 8000 });
    console.log(`[MongoDB] Connected successfully to '${DB_NAME}'.`);

    let insertedCount = 0;
    let updatedCount = 0;
    let unchangedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const id of Object.keys(mapping)) {
      const item = mapping[id];
      // Skip site photography (handled separately in site layout)
      if (item.category === 'Artist Photography') {
        skippedCount++;
        continue;
      }

      const artworkDoc = {
        title: item.title,
        category: item.category,
        medium: item.medium || 'Fine Art Original',
        dimensions: item.dimensions || '',
        price: item.price || null,
        framing: item.framing || 'Unframed',
        status: item.status || 'available',
        year: item.year || new Date().getFullYear().toString(),
        description: item.description || '',
        aspectRatio: item.aspectRatio || 'portrait',
        featured: Boolean(item.featured),
        imageSrc: item.secure_url,
        cloudinaryPublicId: item.public_id,
        commissionSubtype: item.commissionSubtype || null,
      };

      try {
        const existing = await Artwork.findOne({ title: item.title, category: item.category });
        if (!existing) {
          await Artwork.create(artworkDoc);
          console.log(`[INSERTED] ${item.title} -> ${item.secure_url}`);
          insertedCount++;
        } else {
          // Check if imageSrc or other fields changed
          const hasChanged = existing.imageSrc !== item.secure_url || existing.cloudinaryPublicId !== item.public_id;
          if (hasChanged) {
            Object.assign(existing, artworkDoc);
            await existing.save();
            console.log(`[UPDATED] ${item.title} -> ${item.secure_url}`);
            updatedCount++;
          } else {
            console.log(`[UNCHANGED] ${item.title} is already up to date.`);
            unchangedCount++;
          }
        }
      } catch (docErr) {
        console.error(`[FAILED] ${item.title}: ${docErr.message}`);
        failedCount++;
      }
    }

    console.log('===============================================================');
    console.log('MONGODB ARTWORK SYNC REPORT');
    console.log('===============================================================');
    console.log(`Target Database:             ${DB_NAME}`);
    console.log(`Inserted New Artworks:       ${insertedCount}`);
    console.log(`Updated Artworks:            ${updatedCount}`);
    console.log(`Unchanged Artworks:          ${unchangedCount}`);
    console.log(`Failed Artworks:             ${failedCount}`);
    console.log(`Site Photos Preserved:       ${skippedCount}`);
    console.log('===============================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    const safeMsg = err.message ? err.message.replace(/mongodb(\+srv)?:\/\/[^@]+@/, 'mongodb+srv://****:****@') : err;
    console.error(`[MongoDB Sync Error]: ${safeMsg}`);
    process.exit(1);
  }
}

syncArtworksToMongo();
