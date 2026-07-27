import { syncToVectorDB } from '../utils/vectorSync.js';
import Diagram from '../models/Diagram.model.js';

export const createDiagram = async (req, res) => {
  try {
    const newItem = new Diagram(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'DIAGRAM');
    res.status(201).json({ message: 'Diagram saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

