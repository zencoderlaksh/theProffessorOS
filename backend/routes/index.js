import express from 'express';
import lessonRoutes from './lesson.routes.js';
import courseRoutes from './course.routes.js';
import snippetRoutes from './snippet.routes.js';
import exampleRoutes from './example.routes.js';
import analogyRoutes from './analogy.routes.js';
import diagramRoutes from './diagram.routes.js';
import assignmentRoutes from './assignment.routes.js';
import questionRoutes from './question.routes.js';
import projectRoutes from './project.routes.js';
import resourceRoutes from './resource.routes.js';
import noteRoutes from './note.routes.js';
import lectureRoutes from './lecture.routes.js';
import systemRoutes from './system.routes.js';
import searchRoutes from './search.routes.js';
import assistantRoutes from './assistant.routes.js';
import contentRoutes from './content.routes.js';
import aiFeaturesRoutes from './aiFeatures.routes.js';
import discoveryRoutes from './discovery.routes.js';
import growthRoutes from './growth.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/growth', growthRoutes);

router.use('/lessons', lessonRoutes);
router.use('/courses', courseRoutes);
router.use('/snippets', snippetRoutes);
router.use('/examples', exampleRoutes);
router.use('/analogies', analogyRoutes);
router.use('/diagrams', diagramRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/questions', questionRoutes);
router.use('/projects', projectRoutes);
router.use('/resources', resourceRoutes);
router.use('/notes', noteRoutes);
router.use('/lectures', lectureRoutes);
router.use('/search', searchRoutes);
router.use('/assistant', assistantRoutes);
router.use('/content', contentRoutes);
router.use('/ai', aiFeaturesRoutes);
router.use('/discovery', discoveryRoutes);
router.use('/', systemRoutes);

export default router;
