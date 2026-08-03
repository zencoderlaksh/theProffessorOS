import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  channel: String,
  thumbnail: String,
  publishedAt: Date,
  duration: String,
  views: String,
  url: { type: String, unique: true },
  description: String,
  tags: [String],
  category: String,
  isRead: {
    type: String,
    enum: ['Unread', 'Reading', 'Completed'],
    default: 'Unread'
  },
  isBookmarked: { type: Boolean, default: false }
}, { timestamps: true });

export const Video = mongoose.model('Video', videoSchema);
