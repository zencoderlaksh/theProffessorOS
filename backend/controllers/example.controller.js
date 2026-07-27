import { syncToVectorDB } from '../utils/vectorSync.js';
import Example from '../models/Example.model.js';

export const createExample = async (req, res) => {
  try {
    const newItem = new Example(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'EXAMPLE');
    res.status(201).json({ message: 'Example saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

