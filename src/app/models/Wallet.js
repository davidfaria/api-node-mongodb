import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      defautl: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index(
  {
    user: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model('Wallet', schema);
