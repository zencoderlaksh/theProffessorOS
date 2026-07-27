import express from 'express';
import { createLesson } from '../controllers/lesson.controller.js';

const router = express.Router();

router.post('/', createLesson);

export default router;
