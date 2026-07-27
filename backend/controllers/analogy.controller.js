import { syncToVectorDB } from '../utils/vectorSync.js';
import Analogy from '../models/Analogy.model.js';

export const createAnalogy = async (req, res) => {
  try {
    const newItem = new Analogy(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'ANALOGY');
    res.status(201).json({ message: 'Analogy saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

