import { syncToVectorDB } from '../utils/vectorSync.js';
import Assignment from '../models/Assignment.model.js';

export const createAssignment = async (req, res) => {
  try {
    const newItem = new Assignment(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'ASSIGNMENT');
    res.status(201).json({ message: 'Assignment saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

