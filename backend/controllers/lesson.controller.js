import Lesson from '../models/Lesson.model.js';
import Course from '../models/Course.model.js';
import path from 'path';

export const getLessons = async (req, res) => {
  try {
    const { courseId } = req.query;
    const query = courseId ? { courseId } : {};
    const lessons = await Lesson.find(query).populate('courseId').sort({ createdAt: -1 });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadLesson = async (req, res) => {
  try {
    const { title, courseName, newCourseName, notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF or DOC file' });
    }

    const selectedCourseName = newCourseName && newCourseName.trim() ? newCourseName.trim() : courseName;
    if (!selectedCourseName) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    // Find or create Course
    let course = await Course.findOne({ name: selectedCourseName });
    if (!course) {
      course = new Course({ name: selectedCourseName });
      await course.save();
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const ext = path.extname(req.file.originalname).toLowerCase();

    const lesson = new Lesson({
      title: title || req.file.originalname.replace(ext, ''),
      courseId: course._id,
      fileUrl,
      originalName: req.file.originalname,
      fileType: ext.replace('.', '').toUpperCase(),
      fileSize: req.file.size,
      notes: notes || ''
    });

    await lesson.save();
    
    // Return populated lesson
    const populatedLesson = await Lesson.findById(lesson._id).populate('courseId');

    res.status(201).json({
      message: 'Lesson uploaded successfully',
      lesson: populatedLesson,
      course
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
