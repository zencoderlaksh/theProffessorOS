import { News } from '../models/News.model.js';
import { Video } from '../models/Video.model.js';

export const generateWeeklyDigest = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const newsCount = await News.countDocuments({ publishedAt: { $gte: oneWeekAgo } });
    const videoCount = await Video.countDocuments({ publishedAt: { $gte: oneWeekAgo } });

    // Aggregate by category for News
    const newsCategories = await News.aggregate([
      { $match: { publishedAt: { $gte: oneWeekAgo } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Aggregate by category for Videos
    const videoCategories = await Video.aggregate([
      { $match: { publishedAt: { $gte: oneWeekAgo } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Merge categories
    const categoryMap = {};
    newsCategories.forEach(c => categoryMap[c._id] = (categoryMap[c._id] || 0) + c.count);
    videoCategories.forEach(c => categoryMap[c._id] = (categoryMap[c._id] || 0) + c.count);

    const categories = Object.keys(categoryMap).map(cat => ({
      name: cat,
      count: categoryMap[cat]
    }));

    return {
      totalVideos: videoCount,
      totalNews: newsCount,
      categories
    };
  } catch (error) {
    console.error('[Digest] Error generating weekly digest:', error);
    return null;
  }
};
