import cron from 'node-cron';
import { fetchNews, fetchVideos } from './fetcher.service.js';
import { Watchlist } from '../models/Watchlist.model.js';
import { News } from '../models/News.model.js';

// Run every 6 hours
export const startCronJobs = () => {
  console.log('[Cron] Initializing scheduled jobs...');
  
  cron.schedule('0 */6 * * *', async () => {
    console.log('[Cron] Running scheduled fetch tasks...');
    await fetchNews();
    await fetchVideos();
    await generateNotifications();
  });
  
  // Optionally run once immediately on startup for testing/population
  // fetchNews();
  // fetchVideos();
};

// Generates notifications based on user watchlist
const generateNotifications = async () => {
  try {
    const watchlist = await Watchlist.findOne({ userId: 'default_user' });
    if (!watchlist || watchlist.technologies.length === 0) return;

    // Find new news items in the last 6 hours matching the technologies
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const recentNews = await News.find({
      publishedAt: { $gte: sixHoursAgo },
      category: { $in: watchlist.technologies }
    });

    if (recentNews.length > 0) {
      for (const news of recentNews) {
        watchlist.notifications.push({
          message: `🔴 ${news.category} Update Available: ${news.title}`
        });
      }
      await watchlist.save();
      console.log(`[Cron] Generated ${recentNews.length} new notifications.`);
    }
  } catch (error) {
    console.error('[Cron] Error generating notifications:', error);
  }
};
