import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (error) {
  console.warn('Gemini API key not configured or invalid.');
}

/**
 * Generate an embedding for a given text.
 */
export const generateEmbedding = async (text) => {
  if (!genAI) {
    console.warn('Gemini client not initialized. Cannot generate embedding.');
    return [];
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return [];
  }
};

/**
 * Synthesize an answer based on a query and retrieved context.
 */
export const generateAnswer = async (query, contextItems) => {
  if (!genAI) {
    return "GEMINI_API_KEY is not configured on the server. I cannot generate an answer.";
  }

  const systemInstruction = `You are ProfessorOS Assistant, an intelligent teaching aid.
Your job is to answer the user's query based ONLY on the provided context items from the user's knowledge base.
Do NOT invent facts, definitions, or code that is not present in the context.
If the context does not contain enough information to answer the question, clearly state: "I don't have enough information in the knowledge base to answer this."
Use a helpful, educational tone.`;

  let contextString = "### KNOWLEDGE BASE CONTEXT ###\n\n";
  contextItems.forEach((item, index) => {
    contextString += `[Item ${index + 1} | Type: ${item.type}]\n`;
    contextString += `${item.content}\n\n`;
  });

  const prompt = `${contextString}\n\n### USER QUERY ###\n${query}`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating answer:', error);
    return "Sorry, I encountered an error while trying to answer your query.";
  }
};

/**
 * Generate a structured lesson plan.
 */
export const generateLessonPlan = async (topic, contextItems) => {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const systemInstruction = `You are ProfessorOS Lesson Builder, an expert curriculum designer.
Your job is to generate a comprehensive, structured lesson plan for the given topic.
You MUST output the lesson plan in strict JSON format.
The JSON must have the following keys:
{
  "objectives": ["string"],
  "introduction": "string",
  "theory": "string",
  "examples": ["string"],
  "codingDemo": "string",
  "practice": ["string"],
  "assignment": "string",
  "homework": "string",
  "interviewQuestions": ["string"],
  "summary": "string"
}
Whenever possible, integrate information from the provided Knowledge Base Context. If the context is missing information, you may use external knowledge to fill in the gaps to ensure the lesson is complete.`;

  let contextString = "### KNOWLEDGE BASE CONTEXT ###\n\n";
  if (contextItems && contextItems.length > 0) {
    contextItems.forEach((item, index) => {
      contextString += `[Item ${index + 1} | Type: ${item.type}]\n`;
      contextString += `${item.content}\n\n`;
    });
  } else {
    contextString += "No context available in the knowledge base.\n\n";
  }

  const prompt = `${contextString}\n\n### TARGET TOPIC ###\n${topic}\n\nReturn ONLY the raw JSON object. Do not include markdown formatting or \`\`\`json blocks.`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    throw new Error("Failed to generate lesson plan");
  }
};

/**
 * Teaching Assistant Mode
 */
export const generateTeachingAssistantResponse = async (question, contextItems) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  const systemInstruction = `You are a Live Teaching Assistant for ProfessorOS. 
A student has just asked a question in class. You must provide an answer strictly structured in JSON format.
The JSON must have the following keys:
{
  "shortAnswer": "string (1-2 sentences)",
  "detailedAnswer": "string (1 paragraph)",
  "analogy": "string",
  "code": "string (code snippet if applicable, else empty string)",
  "interviewVersion": "string (how to answer this in an interview)"
}
Answer ONLY using the provided Knowledge Base Context. If the context does not contain enough information, state that clearly in the short answer and use general knowledge for the rest but note it as external.`;

  let contextString = "### KNOWLEDGE BASE CONTEXT ###\n\n";
  if (contextItems && contextItems.length > 0) {
    contextItems.forEach((item, index) => {
      contextString += `[Item ${index + 1} | Type: ${item.type}]\n${item.content}\n\n`;
    });
  } else {
    contextString += "No context available.\n\n";
  }

  const prompt = `${contextString}\n\n### STUDENT QUESTION ###\n${question}\n\nReturn ONLY the raw JSON object. Do not include markdown formatting or \`\`\`json blocks.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating TA response:', error);
    throw new Error("Failed to generate Teaching Assistant response");
  }
};

/**
 * AI Content Generator
 */
export const generateContent = async (topic, contentType, contextItems) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  const systemInstruction = `You are an AI Content Generator for ProfessorOS.
Your job is to generate highly contextual educational material of type: "${contentType}".
Output pure Markdown format.
Use the provided Knowledge Base Context heavily to ensure the material aligns with the professor's existing curriculum and style.`;

  let contextString = "### KNOWLEDGE BASE CONTEXT ###\n\n";
  if (contextItems && contextItems.length > 0) {
    contextItems.forEach((item, index) => {
      contextString += `[Item ${index + 1} | Type: ${item.type}]\n${item.content}\n\n`;
    });
  } else {
    contextString += "No context available.\n\n";
  }

  const prompt = `${contextString}\n\n### TOPIC ###\n${topic}\n\nGenerate the content strictly in Markdown format.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error("Failed to generate content");
  }
};
