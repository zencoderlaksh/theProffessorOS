import { generateEmbedding, extractKeywords } from '../services/ai.service.js';
import { upsertVector } from '../services/vector.service.js';

/**
 * Splits text into semantic chunks based on paragraphs.
 */
const chunkText = (text, maxLength = 1000) => {
  const chunks = [];
  const paragraphs = text.split('\n\n');
  let currentChunk = '';

  paragraphs.forEach(p => {
    if ((currentChunk.length + p.length) > maxLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = p;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + p;
    }
  });
  if (currentChunk) chunks.push(currentChunk.trim());
  
  // Fallback if no paragraphs
  if (chunks.length === 0 && text) chunks.push(text.substring(0, maxLength));
  
  return chunks;
};

/**
 * Syncs a MongoDB document to Pinecone by chunking, generating embeddings, and auto-linking.
 */
export const syncToVectorDB = async (item, type) => {
  try {
    let textContent = '';
    
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

    // 1. Auto-Link Related Topics/Keywords
    const keywords = await extractKeywords(textContent);
    if (keywords && keywords.length > 0) {
      console.log(`[KnowledgePipeline] Auto-linked keywords for ${title}:`, keywords);
      // Here you would save 'keywords' to a 'linkedEntities' field in the DB item if required.
    }

    // 2. Semantic Chunking
    const chunks = chunkText(textContent);

    // 3. Generate Embeddings and Store
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);
      
      if (!embedding || embedding.length === 0) continue;

      const vectorId = `${item._id.toString()}-chunk-${i}`;
      const metadata = {
        type,
        parent_id: item._id.toString(),
        title: title.substring(0, 50),
        content: chunk.substring(0, 800), // Keep chunk content in metadata
        linkedKeywords: keywords.join(', ').substring(0, 200)
      };

      await upsertVector(vectorId, embedding, metadata);
    }
    
    console.log(`[KnowledgePipeline] Successfully processed, chunked, and synced ${type} with ID ${item._id}`);
  } catch (error) {
    console.error(`[KnowledgePipeline] Failed to process ${type} with ID ${item._id}:`, error);
  }
};
