import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['BRL'],
      default: 'BRL',
    },
    due_at: {
      type: Date,
      required: true,
    },
    repeat_when: {
      type: String,
    },
    period: {
      type: String,
      default: 'month',
    },
    enrollments: {
      type: Number,
      required: true,
    },
    enrollments_of: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Invoice', schema);
