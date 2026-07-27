import { Pinecone } from '@pinecone-database/pinecone';

let pc;
let index;

try {
  if (process.env.PINECONE_API_KEY) {
    pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    // Default to 'professor-os' if not provided
    const indexName = process.env.PINECONE_INDEX || 'professor-os';
    index = pc.index(indexName);
  }
} catch (error) {
  console.warn('Pinecone API key not configured or invalid.');
}

/**
 * Upsert a vector embedding to Pinecone.
 */
export const upsertVector = async (id, values, metadata) => {
  if (!index) {
    console.warn('Pinecone client not initialized. Cannot upsert vector.');
    return false;
  }
  
  if (!values || values.length === 0) return false;

  try {
    await index.upsert([{
      id,
      values,
      metadata
    }]);
    return true;
  } catch (error) {
    console.error('Error upserting to Pinecone:', error);
    return false;
  }
};

/**
 * Search Pinecone for similar vectors.
 */
export const querySimilar = async (vector, topK = 5, filter = null) => {
  if (!index) {
    console.warn('Pinecone client not initialized. Cannot query vectors.');
    return [];
  }

  try {
    const queryRequest = {
      vector,
      topK,
      includeMetadata: true
    };

    if (filter) {
      queryRequest.filter = filter;
    }

    const response = await index.query(queryRequest);
    return response.matches;
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    return [];
  }
};

/**
 * Delete a vector from Pinecone.
 */
export const deleteVector = async (id) => {
  if (!index) return false;
  
  try {
    await index.deleteOne(id);
    return true;
  } catch (error) {
    console.error('Error deleting from Pinecone:', error);
    return false;
  }
};
