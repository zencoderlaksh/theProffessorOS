import express from 'express';
import { createCodeSnippet } from '../controllers/snippet.controller.js';

const router = express.Router();

router.post('/', createCodeSnippet);

export default router;
