import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Artwork } from '../models/Artwork.js';
import { DB_NAME } from '../config/db.js';
import { getEnv, validateMongoUri } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CANONICAL_TITLES_ORDER = [
  'Memories',
  'Rebirth',
  'Nostalgia',
  'The Depths',
  'The Wild',
  'Desert',
  'Arabic Calligraphy I',
  'Arabic Calligraphy II',
  'Commission I',
  'Commission II',
  'Commission III',
  'Commission IV',
  'Commission V',
  'Commission VI',
  'Commission VII',
  'Commission VIII',
  'Commission IX',
  'Islamic-Inspired Commission I',
  'Islamic-Inspired Commission II',
  'Islamic-Inspired Commission III',
  'Islamic-Inspired Commission IV',
  'Islamic-Inspired Commission V',
];

async function setArtworkOrders() {
  console.log('===============================================================');
  console.log('SHALAGALLERY: SET ARTWORK ORDER MIGRATION');
  console.log(`Target Database: ${DB_NAME}`);
  console.log('===============================================================');

  const { MONGODB_URI } = getEnv();
  const validation = validateMongoUri(MONGODB_URI);

  if (!validation.isValid) {
    console.error(`Error: ${validation.reason}`);
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME, serverSelectionTimeoutMS: 8000 });
    console.log(`[MongoDB] Connected successfully to '${DB_NAME}'.`);

    for (let i = 0; i < CANONICAL_TITLES_ORDER.length; i++) {
      const title = CANONICAL_TITLES_ORDER[i];
      const targetOrder = i + 1;

      const result = await Artwork.updateOne(
        { title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } },
        { $set: { order: targetOrder } }
      );

      if (result.matchedCount > 0) {
        console.log(`[OK] (${targetOrder}) ${title} -> order set to ${targetOrder}`);
      } else {
        console.warn(`[WARN] (${targetOrder}) Artwork with title "${title}" not found!`);
      }
    }

    console.log('\nVerifying resulting artworks order in database:');
    const sortedArtworks = await Artwork.find().sort({ order: 1, createdAt: 1 });
    console.log(`Total artworks in ${DB_NAME}: ${sortedArtworks.length}`);
    sortedArtworks.forEach((art) => {
      console.log(`  ${art.order}. ${art.title} [${art.category} | ${art.status}]`);
    });

    await mongoose.disconnect();
    console.log('\n[Done] Migration complete and MongoDB connection closed.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

setArtworkOrders();
