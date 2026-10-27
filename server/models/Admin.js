import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    isConfigured: {
      type: Boolean,
      default: false,
    },
    setupTokenHash: {
      type: String,
      default: null,
    },
    setupTokenExpires: {
      type: Date,
      default: null,
    },
    resetTokenHash: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.setupTokenHash;
        delete ret.resetTokenHash;
        delete ret.failedLoginAttempts;
        delete ret.lockUntil;
        delete ret.__v;
        return ret;
      },
    },
  }
);

adminSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash || typeof candidatePassword !== 'string') return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

adminSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

export const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
