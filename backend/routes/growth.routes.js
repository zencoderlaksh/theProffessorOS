import express from 'express';
import { getChannels, addChannel, deleteChannel, getGrowthFeed } from '../controllers/growth.controller.js';

const router = express.Router();

router.get('/channels', getChannels);
router.post('/channels', addChannel);
router.delete('/channels/:id', deleteChannel);
router.get('/feed', getGrowthFeed);

export default router;
