import Course from '../models/Course.model.js';
import Lesson from '../models/Lesson.model.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    
    // Attach lessons to each course
    const coursesWithLessons = await Promise.all(
      courses.map(async (course) => {
        const lessons = await Lesson.find({ courseId: course._id }).sort({ createdAt: -1 });
        return { ...course, lessons };
      })
    );

    res.status(200).json(coursesWithLessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    let course = await Course.findOne({ name: name.trim() });
    if (course) {
      return res.status(200).json(course);
    }

    course = new Course({
      name: name.trim(),
      description,
      color: color || '#FF5D73'
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
