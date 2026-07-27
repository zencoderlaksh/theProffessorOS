import express from 'express';
import { askAssistant, semanticSearch } from '../controllers/search.controller.js';

const router = express.Router();

router.post('/ask', askAssistant);
router.post('/semantic', semanticSearch);

export default router;
