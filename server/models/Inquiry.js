import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    inquiryType: {
      type: String,
      enum: ['Existing Artwork', 'Custom Commission', 'Arabic Calligraphy', 'Interior Design Collaboration', 'Other'],
      default: 'Custom Commission',
    },
    artworkTitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: 150,
    },
    dimensions: {
      type: String,
      default: '',
      trim: true,
      maxlength: 100,
    },
    budgetRange: {
      type: String,
      default: '',
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'responded', 'archived'],
      default: 'unread',
    },
    ipHash: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret.ipHash;
        return ret;
      },
    },
  }
);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
