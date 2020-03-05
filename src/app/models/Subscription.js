import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'active',
    },
    pay_status: {
      type: String,
      required: true,
      default: 'active',
    },
    started_at: {
      type: Date,
      required: true,
    },
    due_day: {
      type: String,
      required: true,
    },
    next_due: {
      type: Date,
      required: true,
    },
    last_charge: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Subscription', schema);
