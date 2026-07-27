import { syncToVectorDB } from '../utils/vectorSync.js';
import TeachingNote from '../models/TeachingNote.model.js';

export const createTeachingNote = async (req, res) => {
  try {
    const newItem = new TeachingNote(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'NOTE');
    res.status(201).json({ message: 'TeachingNote saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

