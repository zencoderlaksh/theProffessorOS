import express from 'express';
import { getExamples, createExample, deleteExample, generateAIExamplesController } from '../controllers/example.controller.js';

const router = express.Router();

router.get('/', getExamples);
router.post('/', createExample);
router.delete('/:id', deleteExample);
router.post('/generate', generateAIExamplesController);

export default router;
