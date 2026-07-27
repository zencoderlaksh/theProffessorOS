import express from 'express';
import { createExample } from '../controllers/example.controller.js';

const router = express.Router();

router.post('/', createExample);

export default router;
