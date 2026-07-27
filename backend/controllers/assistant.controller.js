import { generateEmbedding, generateTeachingAssistantResponse } from '../services/ai.service.js';
import { querySimilar } from '../services/vector.service.js';

export const teachAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const queryVector = await generateEmbedding(question);
    let contextItems = [];

    if (queryVector && queryVector.length > 0) {
      const matches = await querySimilar(queryVector, 5);
      if (matches && matches.length > 0) {
        contextItems = matches.map(match => ({
          type: match.metadata.type,
          title: match.metadata.title,
          content: match.metadata.content
        }));
      }
    }

    const response = await generateTeachingAssistantResponse(question, contextItems);

    res.json(response);
  } catch (error) {
    console.error('Error in teachAssistant:', error);
    res.status(500).json({ error: error.message });
  }
};
