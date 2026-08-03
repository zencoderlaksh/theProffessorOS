import express from 'express';
import {
  getDashboard,
  searchContent,
  toggleBookmark,
  updateStatus,
  getBookmarks,
  getWeeklyDigest,
  getWatchlist,
  updateWatchlist,
  clearNotifications,
  triggerFetch
} from '../controllers/discovery.controller.js';

const router = express.Router();

router.get('/dashboard', getDashboard);
router.get('/search', searchContent);
router.put('/bookmark', toggleBookmark);
router.put('/status', updateStatus);
router.get('/bookmarks', getBookmarks);
router.get('/digest', getWeeklyDigest);
router.get('/watchlist', getWatchlist);
router.put('/watchlist', updateWatchlist);
router.put('/notifications/clear', clearNotifications);
router.post('/fetch', triggerFetch); // Manual trigger

export default router;
