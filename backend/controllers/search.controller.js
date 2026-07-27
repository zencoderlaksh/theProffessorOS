import { generateEmbedding, generateAnswer } from '../services/ai.service.js';
import { querySimilar } from '../services/vector.service.js';

export const askAssistant = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    // 1. Generate embedding for the user's natural language query
    const queryVector = await generateEmbedding(query);
    if (!queryVector || queryVector.length === 0) {
      return res.status(500).json({ error: 'Failed to generate embedding for query.' });
    }

    // 2. Query Pinecone for the top 5 most similar documents
    const matches = await querySimilar(queryVector, 5);
    
    if (!matches || matches.length === 0) {
      return res.json({ 
        answer: "I couldn't find any relevant information in your knowledge base to answer this query.",
        sources: [] 
      });
    }

    // 3. Extract metadata from matches to form the context for the LLM
    const contextItems = matches.map(match => ({
      type: match.metadata.type,
      title: match.metadata.title,
      content: match.metadata.content
    }));

    // 4. Synthesize answer using Gemini
    const answer = await generateAnswer(query, contextItems);

    res.json({
      answer,
      sources: contextItems
    });
  } catch (error) {
    console.error('Error in askAssistant:', error);
    res.status(500).json({ error: error.message });
  }
};

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const queryVector = await generateEmbedding(query);
    if (!queryVector || queryVector.length === 0) {
      return res.status(500).json({ error: 'Failed to generate embedding for query.' });
    }

    const matches = await querySimilar(queryVector, 8); // Top 8 for normal semantic search
    
    if (!matches || matches.length === 0) {
      return res.json({ results: [] });
    }

    const results = matches.map(match => ({
      type: match.metadata.type,
      title: match.metadata.title,
      content: match.metadata.content,
      score: match.score // Include similarity score if needed on frontend
    }));

    res.json({ results });
  } catch (error) {
    console.error('Error in semanticSearch:', error);
    res.status(500).json({ error: error.message });
  }
};
