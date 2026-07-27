import express from 'express';
import { createResource } from '../controllers/resource.controller.js';

const router = express.Router();

router.post('/', createResource);

export default router;
