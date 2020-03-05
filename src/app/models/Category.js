import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema(
  {
    sub_of: {
      category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
      },
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enun: ['income', 'expense'],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Category', schema);
