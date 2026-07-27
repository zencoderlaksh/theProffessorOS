import { syncToVectorDB } from '../utils/vectorSync.js';
import Resource from '../models/Resource.model.js';

export const createResource = async (req, res) => {
  try {
    const newItem = new Resource(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'RESOURCE');
    res.status(201).json({ message: 'Resource saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

