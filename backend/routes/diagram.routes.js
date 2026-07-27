import express from 'express';
import { createDiagram } from '../controllers/diagram.controller.js';

const router = express.Router();

router.post('/', createDiagram);

export default router;
