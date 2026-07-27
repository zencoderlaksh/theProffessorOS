import { syncToVectorDB } from '../utils/vectorSync.js';
import Lesson from '../models/Lesson.model.js';

export const createLesson = async (req, res) => {
  try {
    const newItem = new Lesson(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'LESSON');
    res.status(201).json({ message: 'Lesson saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

