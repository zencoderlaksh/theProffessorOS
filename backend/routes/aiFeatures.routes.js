import express from 'express';
import {
  getRecommendations,
  getKeywords,
  checkKnowledgeGaps,
  createCourse,
  getUniversityMaterial,
  getTopicGraph,
  getPrompts,
  createPrompt,
  getUserProfile,
  updateUserProfile
} from '../controllers/aiFeatures.controller.js';

const router = express.Router();

// Smart Recommendations
router.post('/recommendations', getRecommendations);

// Auto Linking
router.post('/keywords', getKeywords);

// Knowledge Gap Detection
router.post('/gaps', checkKnowledgeGaps);

// Course Builder
router.post('/course', createCourse);

// University Mode
router.post('/university', getUniversityMaterial);

// Relationship Engine
router.get('/graph', getTopicGraph);

// Prompt Library
router.get('/prompts', getPrompts);
router.post('/prompts', createPrompt);

// User Profile (Teaching Style & Memory)
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

export default router;
