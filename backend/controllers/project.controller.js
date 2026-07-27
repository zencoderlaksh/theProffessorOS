import { syncToVectorDB } from '../utils/vectorSync.js';
import Project from '../models/Project.model.js';

export const createProject = async (req, res) => {
  try {
    const newItem = new Project(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'PROJECT');
    res.status(201).json({ message: 'Project saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

