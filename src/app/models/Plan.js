import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
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

export default mongoose.model('Plan', schema);
