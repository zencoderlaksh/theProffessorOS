import express from 'express';
import { createAnalogy } from '../controllers/analogy.controller.js';

const router = express.Router();

router.post('/', createAnalogy);

export default router;
