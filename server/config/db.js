import mongoose from 'mongoose';
import { getEnv, validateMongoUri } from './env.js';

export const DB_NAME = 'Shala_gallery';

let isConnected = false;

export const connectDB = async () => {
  const { MONGODB_URI } = getEnv();
  const validation = validateMongoUri(MONGODB_URI);

  if (!validation.isValid) {
    if (validation.isPlaceholder) {
      console.warn(
        `[Database] Notice: MONGODB_URI contains placeholders ('REPLACE_WITH_...'). Set your actual Atlas password in .env to connect.`
      );
    } else {
      console.warn(`[Database] Notice: ${validation.reason}`);
    }
    return false;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 8000,
    });

    isConnected = true;
    console.log(`[Database] MongoDB Atlas connected successfully: host=${conn.connection.host}, database=${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    // Sanitize any credentials from error output
    const safeMessage = error.message
      ? error.message.replace(/mongodb(\+srv)?:\/\/[^@]+@/, 'mongodb+srv://****:****@')
      : 'Connection error';
    console.error(`[Database] MongoDB Atlas connection failed: ${safeMessage}`);
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[Database] MongoDB Atlas disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('[Database] MongoDB Atlas reconnected.');
});

export const getDBStatus = () => {
  const stateCode = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    state: states[stateCode] || 'unknown',
    connected: stateCode === 1,
    database: stateCode === 1 ? DB_NAME : null,
    targetDatabase: DB_NAME,
  };
};
