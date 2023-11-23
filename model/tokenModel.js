import mongoose, { Schema } from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  token: { required: true, type: String },
  createdAt: { type: Date, default: Date.now(), expires: 1800 },
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;
