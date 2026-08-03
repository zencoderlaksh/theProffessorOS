import express from 'express';
import { createLecture, generateLecture, generateSlidesFromLesson } from '../controllers/lecture.controller.js';

const router = express.Router();

router.post('/', createLecture);
router.post('/generate', generateLecture);
router.post('/generate-slides', generateSlidesFromLesson);

export default router;
