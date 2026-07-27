import Lecture from '../models/Lecture.model.js';
import { syncToVectorDB } from '../utils/vectorSync.js';
import { generateEmbedding, generateLessonPlan } from '../services/ai.service.js';
import { querySimilar } from '../services/vector.service.js';

export const createLecture = async (req, res) => {
  try {
    const newItem = new Lecture(req.body);
    await newItem.save();
    // Trigger async vector sync in background
    syncToVectorDB(newItem, 'LECTURE');
    res.status(201).json({ message: 'Lecture saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateLecture = async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required to generate a lecture.' });
    }

    // 1. Convert topic to vector
    const topicVector = await generateEmbedding(topic);
    let contextItems = [];

    // 2. Fetch relevant items from knowledge base
    if (topicVector && topicVector.length > 0) {
      const matches = await querySimilar(topicVector, 10);
      if (matches && matches.length > 0) {
        contextItems = matches.map(match => ({
          type: match.metadata.type,
          title: match.metadata.title,
          content: match.metadata.content
        }));
      }
    }

    // 3. Synthesize the structured lecture plan
    const generatedPlan = await generateLessonPlan(topic, contextItems);

    res.json({ plan: generatedPlan, sources: contextItems });
  } catch (error) {
    console.error('Error in generateLecture:', error);
    res.status(500).json({ error: error.message });
  }
};
