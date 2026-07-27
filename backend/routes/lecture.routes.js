import express from 'express';
import { createLecture, generateLecture } from '../controllers/lecture.controller.js';

const router = express.Router();

router.post('/', createLecture);
router.post('/generate', generateLecture);

export default router;
