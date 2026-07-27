import express from 'express';
import { teachAssistant } from '../controllers/assistant.controller.js';

const router = express.Router();

router.post('/teach', teachAssistant);

export default router;
