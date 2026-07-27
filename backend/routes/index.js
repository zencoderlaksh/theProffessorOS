import express from 'express';
import lessonRoutes from './lesson.routes.js';
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

const router = express.Router();

router.use('/lessons', lessonRoutes);
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
router.use('/', systemRoutes);

export default router;
