import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { DB_NAME } from '../config/db.js';
import { getEnv, validateMongoUri, isAuthorizedAdminEmail } from '../config/env.js';

const run = async () => {
  const { MONGODB_URI, ADMIN_EMAIL } = getEnv();
  const validation = validateMongoUri(MONGODB_URI);

  if (!validation.isValid) {
    console.error(`Error: ${validation.reason}`);
    process.exit(1);
  }

  // Parse email argument (--email=... or --email ...)
  let targetEmail = ADMIN_EMAIL;
  const emailArgIndex = process.argv.findIndex((arg) => arg.startsWith('--email=') || arg === '--email');
  if (emailArgIndex !== -1) {
    const arg = process.argv[emailArgIndex];
    if (arg.startsWith('--email=')) {
      targetEmail = arg.split('=')[1].trim().toLowerCase();
    } else if (process.argv[emailArgIndex + 1]) {
      targetEmail = process.argv[emailArgIndex + 1].trim().toLowerCase();
    }
  }

  // Parse token expiration hours (--hours=..., default 48 hours for client setup)
  let expirationHours = 48;
  const hoursArgIndex = process.argv.findIndex((arg) => arg.startsWith('--hours=') || arg === '--hours');
  if (hoursArgIndex !== -1) {
    const arg = process.argv[hoursArgIndex];
    const val = arg.startsWith('--hours=') ? arg.split('=')[1] : process.argv[hoursArgIndex + 1];
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      expirationHours = parsed;
    }
  }

  if (!isAuthorizedAdminEmail(targetEmail)) {
    console.warn(`[Notice] ${targetEmail} is being added as an administrator.`);
  }

  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME, serverSelectionTimeoutMS: 8000 });
    console.log(`Connected to database '${DB_NAME}'.`);

    let admin = await Admin.findOne({ email: targetEmail });
    const isNewAccount = !admin;
    if (!admin) {
      admin = new Admin({ email: targetEmail, isConfigured: false });
      console.log(`Provisioning new administrator account record for: ${targetEmail}`);
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
      console.log(`Administrator password set successfully for ${targetEmail}.`);
      console.log('Production Portal: https://shalagallery.vercel.app/admin');
      console.log('===============================================================');
    } else if (admin.isConfigured && !isResetRequested && !isNewAccount) {
      console.log('===============================================================');
      console.log(`ADMIN STATUS: Administrator account is ALREADY configured for ${targetEmail}.`);
      console.log('Login portal: https://shalagallery.vercel.app/admin');
      console.log('---------------------------------------------------------------');
      console.log('To generate a secure single-use password reset link, run:');
      console.log(`  node server/scripts/init-admin.js --email=${targetEmail} --reset`);
      console.log('Or to update the password directly from the server CLI, run:');
      console.log(`  node server/scripts/init-admin.js --email=${targetEmail} --password=YourNewPassword`);
      console.log('===============================================================');
    } else {
      // Generate secure setup / reset token
      const rawToken = crypto.randomBytes(24).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

      // We assign both resetTokenHash and setupTokenHash for universal compatibility
      admin.resetTokenHash = tokenHash;
      admin.resetTokenExpires = expiresAt;
      admin.setupTokenHash = tokenHash;
      admin.setupTokenExpires = expiresAt;
      await admin.save();

      const prodLink = `https://shalagallery.vercel.app/admin?action=reset&token=${rawToken}&email=${encodeURIComponent(targetEmail)}`;
      const localLink = `http://localhost:5173/admin?action=reset&token=${rawToken}&email=${encodeURIComponent(targetEmail)}`;

      console.log('===============================================================');
      console.log(`SHALAGALLERY SECURE PASSWORD SETUP / RESET TOKEN`);
      console.log('===============================================================');
      console.log(`Admin Account:   ${targetEmail}`);
      console.log(`Account Status:  ${isNewAccount ? 'Newly Provisioned' : 'Existing Account (Reset Requested)'}`);
      console.log(`Token Validity:  ${expirationHours} hour(s) (single-use, auto-expires on completion)`);
      console.log(`Setup Token:     ${rawToken}`);
      console.log('---------------------------------------------------------------');
      console.log(`PRODUCTION URL:  ${prodLink}`);
      console.log(`LOCAL URL:       ${localLink}`);
      console.log('===============================================================');
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
