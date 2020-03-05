import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    brand: {
      type: String,
      required: true,
    },
    last_digits: {
      type: Number,
      required: true,
    },
    cvv: {
      type: Number,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Card', schema);
