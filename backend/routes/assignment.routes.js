import express from 'express';
import { createAssignment } from '../controllers/assignment.controller.js';

const router = express.Router();

router.post('/', createAssignment);

export default router;
