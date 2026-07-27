import express from 'express';
import { createTeachingNote } from '../controllers/note.controller.js';

const router = express.Router();

router.post('/', createTeachingNote);

export default router;
