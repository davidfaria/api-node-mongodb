import mongoose from 'mongoose';
import { generateBcryptHash } from '@helpers/hash';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['registred', 'confirmed', 'canceled'],
      default: 'registred',
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    forgetAt: {
      type: Date,
      default: null,
    },
    forget: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await generateBcryptHash(this.password, 8);
  next();
});

export default mongoose.model('User', schema);
