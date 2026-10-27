import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Landscape & Realism', 'Abstract Art', 'Arabic Calligraphy', 'Previous Commissions'],
    },
    medium: {
      type: String,
      default: '',
    },
    dimensions: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: String,
      default: null,
      trim: true,
    },
    framing: {
      type: String,
      default: 'Unframed',
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'commissioned', 'private_collection'],
      default: 'available',
    },
    year: {
      type: String,
      default: () => new Date().getFullYear().toString(),
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    aspectRatio: {
      type: String,
      enum: ['landscape', 'portrait', 'square', 'tall'],
      default: 'portrait',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 1000,
    },
    imageSrc: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
      trim: true,
    },
    commissionSubtype: {
      type: String,
      default: null,
    },
    visualStyle: {
      baseTone: { type: String, default: '#8A7A68' },
      accentTone: { type: String, default: '#C5A86E' },
      atmosphere: { type: String, default: 'Fine Art Studio Piece' },
      textureType: {
        type: String,
        enum: ['canvas', 'linen', 'parchment', 'gold_leaf'],
        default: 'canvas',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Artwork = mongoose.model('Artwork', artworkSchema);
export default Artwork;
