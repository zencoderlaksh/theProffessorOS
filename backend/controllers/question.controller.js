import { syncToVectorDB } from '../utils/vectorSync.js';
import Question from '../models/Question.model.js';

export const createQuestion = async (req, res) => {
  try {
    const newItem = new Question(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'QUESTION');
    res.status(201).json({ message: 'Question saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

