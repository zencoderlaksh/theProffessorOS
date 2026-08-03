import express from 'express';
import { loginAdmin, verifyAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/verify', verifyAdmin);

export default router;
