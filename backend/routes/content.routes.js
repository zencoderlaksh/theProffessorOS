import express from 'express';
import { generateAIContent } from '../controllers/content.controller.js';

const router = express.Router();

router.post('/generate', generateAIContent);

export default router;
