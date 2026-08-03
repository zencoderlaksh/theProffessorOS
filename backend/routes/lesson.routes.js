import express from 'express';
import { getLessons, uploadLesson } from '../controllers/lesson.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', getLessons);
router.post('/upload', upload.single('file'), uploadLesson);

export default router;
