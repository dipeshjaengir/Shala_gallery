import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { DB_NAME } from '../config/db.js';
import { getEnv, validateMongoUri } from '../config/env.js';

const run = async () => {
  const { MONGODB_URI, ADMIN_EMAIL } = getEnv();
  const validation = validateMongoUri(MONGODB_URI);

  if (!validation.isValid) {
    console.error(`Error: ${validation.reason}`);
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME, serverSelectionTimeoutMS: 8000 });
    console.log(`Connected to database '${DB_NAME}'.`);

    let admin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      admin = new Admin({ email: ADMIN_EMAIL, isConfigured: false });
    }

    // Check if direct password argument was provided
    const passwordArg = process.argv.find((arg) => arg.startsWith('--password='));
    const isResetRequested = process.argv.includes('--reset');

    if (passwordArg) {
      const rawPassword = passwordArg.split('=')[1];
      if (!rawPassword || rawPassword.length < 8) {
        console.error('Error: Password must be at least 8 characters long.');
        process.exit(1);
      }

      const salt = await bcrypt.genSalt(12);
      admin.passwordHash = await bcrypt.hash(rawPassword, salt);
      admin.isConfigured = true;
      admin.setupTokenHash = null;
      admin.setupTokenExpires = null;
      admin.resetTokenHash = null;
      admin.resetTokenExpires = null;
      admin.failedLoginAttempts = 0;
      admin.lockUntil = null;
      await admin.save();

      console.log('===============================================================');
      console.log(`Administrator password set successfully for ${ADMIN_EMAIL}.`);
      console.log('You can now log in at: http://localhost:5173/?tab=admin');
      console.log('===============================================================');
    } else if (admin.isConfigured && !isResetRequested) {
      console.log('===============================================================');
      console.log(`ADMIN STATUS: Administrator account is ALREADY configured for ${ADMIN_EMAIL}.`);
      console.log('Login portal: http://localhost:5173/?tab=admin');
      console.log('---------------------------------------------------------------');
      console.log('To generate a secure single-use password reset link, run:');
      console.log('  node server/scripts/init-admin.js --reset');
      console.log('Or to update your password directly from the server CLI, run:');
      console.log('  node server/scripts/init-admin.js --password=YourNewPassword');
      console.log('===============================================================');
    } else {
      // Generate secure setup or reset token
      const rawToken = crypto.randomBytes(24).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      if (isResetRequested) {
        admin.resetTokenHash = tokenHash;
        admin.resetTokenExpires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        await admin.save();

        console.log('===============================================================');
        console.log('SHALAGALLERY SECURE PASSWORD RESET TOKEN');
        console.log('===============================================================');
        console.log(`Admin Email: ${ADMIN_EMAIL}`);
        console.log(`Reset Token: ${rawToken}`);
        console.log(`Reset Link:  http://localhost:5173/?tab=admin&action=reset&token=${rawToken}`);
        console.log('Valid for:   2 hours (single-use)');
        console.log('===============================================================');
      } else {
        admin.setupTokenHash = tokenHash;
        admin.setupTokenExpires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        await admin.save();

        console.log('===============================================================');
        console.log('SHALAGALLERY SECURE ADMINISTRATOR INITIALIZATION');
        console.log('===============================================================');
        console.log(`Admin Email: ${ADMIN_EMAIL}`);
        console.log(`Setup Token: ${rawToken}`);
        console.log(`Setup Link:  http://localhost:5173/?tab=admin&action=setup&token=${rawToken}`);
        console.log('Valid for:   2 hours (single-use)');
        console.log('---------------------------------------------------------------');
        console.log('Open the setup link in your browser to configure your password,');
        console.log('or run: node server/scripts/init-admin.js --password=YourChosenPassword');
        console.log('===============================================================');
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    const safeMsg = error.message ? error.message.replace(/mongodb(\+srv)?:\/\/[^@]+@/, 'mongodb+srv://****:****@') : error;
    console.error('Initialization error:', safeMsg);
    process.exit(1);
  }
};

run();
