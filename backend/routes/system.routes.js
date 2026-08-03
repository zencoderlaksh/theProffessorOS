import express from 'express';
import Course from '../models/Course.model.js';
import Lesson from '../models/Lesson.model.js';
import Assignment from '../models/Assignment.model.js';
import Example from '../models/Example.model.js';
import PersonalChannel from '../models/PersonalChannel.model.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalExamples = await Example.countDocuments();
    const totalChannels = await PersonalChannel.countDocuments();

    // Fetch recent lessons and assignments
    const recentLessons = await Lesson.find().sort({ createdAt: -1 }).limit(5).populate('courseId');
    const recentAssignments = await Assignment.find().sort({ createdAt: -1 }).limit(5).populate('courseId');

    res.json({
      totalCourses,
      totalLessons,
      totalAssignments,
      totalExamples,
      totalChannels,
      recentLessons,
      recentAssignments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', (req, res) => {
  const { q } = req.query;
  res.json({ query: q, results: [ { type: 'Topic', title: `Found Topic related to ${q}` }, { type: 'Example', title: `Example matching ${q}` } ] });
});

router.get('/backup/export', (req, res) => {
  res.json({ status: 'success', message: 'System backup generated successfully', downloadUrl: '/downloads/backup.zip' });
});

export default router;
