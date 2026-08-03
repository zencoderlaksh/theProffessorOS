import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  summary: String,
  source: String,
  category: String,
  publishedAt: Date,
  image: String,
  url: { type: String, unique: true },
  tags: [String],
  isRead: {
    type: String,
    enum: ['Unread', 'Reading', 'Completed'],
    default: 'Unread'
  },
  importance: { type: Number, default: 0 },
  isBookmarked: { type: Boolean, default: false }
}, { timestamps: true });

export const News = mongoose.model('News', newsSchema);
