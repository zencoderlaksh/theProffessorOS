import { News } from '../models/News.model.js';
import { Video } from '../models/Video.model.js';
import { Watchlist } from '../models/Watchlist.model.js';
import { generateWeeklyDigest } from '../services/digest.service.js';
import { fetchNews, fetchVideos } from '../services/fetcher.service.js';

export const getDashboard = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: 'default_user' });
    const filters = {};
    if (watchlist && watchlist.technologies.length > 0) {
      filters.category = { $in: watchlist.technologies };
    }

    const news = await News.find(filters).sort({ publishedAt: -1 }).limit(10);
    const videos = await Video.find(filters).sort({ publishedAt: -1 }).limit(10);
    
    res.json({ news, videos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchContent = async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i');
    const news = await News.find({ title: regex });
    const videos = await Video.find({ title: regex });
    res.json({ news, videos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { id, type } = req.body;
    const Model = type === 'news' ? News : Video;
    const item = await Model.findById(id);
    if (item) {
      item.isBookmarked = !item.isBookmarked;
      await item.save();
      res.json(item);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id, type, isRead } = req.body;
    const Model = type === 'news' ? News : Video;
    const item = await Model.findByIdAndUpdate(id, { isRead }, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const news = await News.find({ isBookmarked: true });
    const videos = await Video.find({ isBookmarked: true });
    res.json({ news, videos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWeeklyDigest = async (req, res) => {
  try {
    const digest = await generateWeeklyDigest();
    res.json(digest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    let list = await Watchlist.findOne({ userId: 'default_user' });
    if (!list) {
      list = await Watchlist.create({ userId: 'default_user', technologies: [] });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWatchlist = async (req, res) => {
  try {
    const { technologies } = req.body;
    const list = await Watchlist.findOneAndUpdate(
      { userId: 'default_user' },
      { technologies },
      { new: true, upsert: true }
    );
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearNotifications = async (req, res) => {
  try {
    const list = await Watchlist.findOneAndUpdate(
      { userId: 'default_user' },
      { $set: { "notifications.$[].isRead": true } },
      { new: true }
    );
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DEV ONLY endpoint to manually trigger cron fetch
export const triggerFetch = async (req, res) => {
  try {
    await fetchNews();
    await fetchVideos();
    res.json({ message: 'Fetch triggered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
