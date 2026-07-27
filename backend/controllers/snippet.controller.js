import { syncToVectorDB } from '../utils/vectorSync.js';
import CodeSnippet from '../models/CodeSnippet.model.js';

export const createCodeSnippet = async (req, res) => {
  try {
    const newItem = new CodeSnippet(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'SNIPPET');
    res.status(201).json({ message: 'CodeSnippet saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

