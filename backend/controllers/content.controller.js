import { generateEmbedding, generateContent } from '../services/ai.service.js';
import { querySimilar } from '../services/vector.service.js';

export const generateAIContent = async (req, res) => {
  try {
    const { topic, contentType } = req.body;
    
    if (!topic || !contentType) {
      return res.status(400).json({ error: 'Topic and contentType are required.' });
    }

    const queryVector = await generateEmbedding(topic);
    let contextItems = [];

    if (queryVector && queryVector.length > 0) {
      const matches = await querySimilar(queryVector, 8);
      if (matches && matches.length > 0) {
        contextItems = matches.map(match => ({
          type: match.metadata.type,
          title: match.metadata.title,
          content: match.metadata.content
        }));
      }
    }

    const content = await generateContent(topic, contentType, contextItems);

    res.json({ content });
  } catch (error) {
    console.error('Error in generateAIContent:', error);
    res.status(500).json({ error: error.message });
  }
};
