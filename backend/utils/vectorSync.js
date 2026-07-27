import { generateEmbedding } from '../services/ai.service.js';
import { upsertVector } from '../services/vector.service.js';

/**
 * Syncs a MongoDB document to Pinecone by serializing it to text and generating an embedding.
 * @param {Object} item - The Mongoose document
 * @param {String} type - The type of the document (e.g., 'Analogy', 'Topic', 'Example')
 */
export const syncToVectorDB = async (item, type) => {
  try {
    // 1. Serialize the document to a text string for embedding
    let textContent = '';
    
    // We dynamically pull available fields to construct a comprehensive representation
    const title = item.title || item.name || '';
    const description = item.description || item.content || item.theory || item.text || '';
    const code = item.code || item.snippet || '';
    
    textContent += `Type: ${type}\n`;
    if (title) textContent += `Title: ${title}\n`;
    if (description) textContent += `Description: ${description}\n`;
    if (code) textContent += `Code: ${code}\n`;
    
    if (item.tags && Array.isArray(item.tags)) {
      textContent += `Tags: ${item.tags.join(', ')}\n`;
    }

    if (!textContent.trim()) return;

    // 2. Generate the embedding
    const embedding = await generateEmbedding(textContent);
    
    if (!embedding || embedding.length === 0) return;

    // 3. Upsert to Vector DB
    const vectorId = item._id.toString();
    const metadata = {
      type,
      title: title.substring(0, 50), // keep metadata small
      content: textContent.substring(0, 500) // keep a chunk of content in metadata for fast retrieval
    };

    await upsertVector(vectorId, embedding, metadata);
    console.log(`[VectorDB] Successfully synced ${type} with ID ${vectorId}`);
  } catch (error) {
    console.error(`[VectorDB] Failed to sync ${type} with ID ${item._id}:`, error);
  }
};
