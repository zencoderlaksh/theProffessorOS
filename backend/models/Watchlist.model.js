import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: { type: String, default: 'default_user', unique: true },
  technologies: [String],
  notifications: [{
    message: String,
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export const Watchlist = mongoose.model('Watchlist', watchlistSchema);
