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
export const generateAnswer = async (query, contextItems, userProfile = null) => {
  if (!genAI) {
    return "GEMINI_API_KEY is not configured on the server. I cannot generate an answer.";
  }

  let profileContext = "";
  if (userProfile) {
    profileContext = `\n\nTEACHING STYLE: ${userProfile.teachingStyle}\nAI MEMORY: ${userProfile.aiMemory.join(', ')}\nEnsure your response follows this teaching style.`;
  }

  const systemInstruction = `You are ProfessorOS Assistant, an intelligent teaching aid.
Your job is to answer the user's query based ONLY on the provided context items from the user's knowledge base.
Do NOT invent facts, definitions, or code that is not present in the context.
If the context does not contain enough information to answer the question, clearly state: "I don't have enough information in the knowledge base to answer this."
Use a helpful, educational tone.${profileContext}`;

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
export const generateLessonPlan = async (topic, contextItems, userProfile = null) => {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  let profileContext = "";
  if (userProfile) {
    profileContext = `\n\nTEACHING STYLE: ${userProfile.teachingStyle}\nAI MEMORY: ${userProfile.aiMemory.join(', ')}\nEnsure your response follows this teaching style.`;
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
Whenever possible, integrate information from the provided Knowledge Base Context. If the context is missing information, you may use external knowledge to fill in the gaps to ensure the lesson is complete.${profileContext}`;

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
export const generateTeachingAssistantResponse = async (question, contextItems, userProfile = null) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  let profileContext = "";
  if (userProfile) {
    profileContext = `\n\nTEACHING STYLE: ${userProfile.teachingStyle}\nAI MEMORY: ${userProfile.aiMemory.join(', ')}\nEnsure your response follows this teaching style.`;
  }

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
Answer ONLY using the provided Knowledge Base Context. If the context does not contain enough information, state that clearly in the short answer and use general knowledge for the rest but note it as external.${profileContext}`;

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
export const generateContent = async (topic, contentType, contextItems, userProfile = null) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  let profileContext = "";
  if (userProfile) {
    profileContext = `\n\nTEACHING STYLE: ${userProfile.teachingStyle}\nAI MEMORY: ${userProfile.aiMemory.join(', ')}\nEnsure your response follows this teaching style.`;
  }

  const systemInstruction = `You are an AI Content Generator for ProfessorOS.
Your job is to generate highly contextual educational material of type: "${contentType}".
Output pure Markdown format.
Use the provided Knowledge Base Context heavily to ensure the material aligns with the professor's existing curriculum and style.${profileContext}`;

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

/**
 * Smart Recommendations (Module 14)
 */
export const generateRecommendations = async (draftText, availableResources) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  const systemInstruction = `You are a Smart Recommendation Engine.
The user is writing content. Based on the text they've written so far, suggest 2-3 relevant resources from their available list.
Return ONLY JSON with a "recommendations" array of resource IDs.
{ "recommendations": ["id1", "id2"] }`;

  const prompt = `### DRAFT TEXT ###\n${draftText}\n\n### AVAILABLE RESOURCES ###\n${JSON.stringify(availableResources)}\n\nReturn JSON.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in recommendations:', error);
    return { recommendations: [] };
  }
};

/**
 * Auto Linking (Module 15)
 */
export const extractKeywords = async (text) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  const systemInstruction = `You extract technical keywords from text for auto-linking.
Return ONLY JSON with a "keywords" array of strings.
{ "keywords": ["JWT", "Authentication", "Express Middleware"] }`;

  const prompt = `Extract keywords from this text:\n\n${text}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
    const result = await model.generateContent(prompt);
    const jsonText = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText).keywords || [];
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return [];
  }
};

/**
 * Knowledge Gap Detection (Module 16)
 */
export const detectKnowledgeGaps = async (topic, currentSubtopics) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  const systemInstruction = `You analyze a technical topic and the current subtopics taught, and detect what is missing.
Return ONLY JSON with a "missing" array of strings (e.g., ["Context API", "Suspense"]).`;

  const prompt = `Topic: ${topic}\nCurrent Subtopics: ${currentSubtopics.join(', ')}\n\nWhat important subtopics are missing? Return JSON.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
    const result = await model.generateContent(prompt);
    const jsonText = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText).missing || [];
  } catch (error) {
    console.error('Error detecting gaps:', error);
    return [];
  }
};

/**
 * Course Builder (Module 17)
 */
export const buildCourse = async (techStack) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  const systemInstruction = `You are a Course Architect. Create a complete course for the given tech stack.
Return STRICT JSON.
Format:
{
  "title": "String",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "String",
      "topics": ["String"],
      "projects": ["String"],
      "assignments": ["String"]
    }
  ]
}`;

  const prompt = `Create a course for: ${techStack}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
    const result = await model.generateContent(prompt);
    const jsonText = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error building course:', error);
    throw new Error('Course generation failed');
  }
};

/**
 * University Mode (Module 18)
 */
export const generateUniversityMaterial = async (semester, subject) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  const systemInstruction = `You prepare university exam material.
Return STRICT JSON.
Format:
{
  "importantQuestions": ["String"],
  "expectedQuestions": ["String"],
  "assignments": ["String"],
  "labPracticals": ["String"]
}`;

  const prompt = `Prepare material for Semester: ${semester}, Subject: ${subject}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
    const result = await model.generateContent(prompt);
    const jsonText = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating university material:', error);
    throw new Error('University material generation failed');
  }
};

/**
 * Generate Presentation Slides from Document Text
 */
export const generateSlidesFromDocument = async (documentText, title) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  const systemInstruction = `You are a Master Educator and Presentation Designer for ProfessorOS.
Your job is to read the provided document content and transform it into a structured, highly engaging lecture presentation deck.
Output MUST be strict JSON matching this structure:
{
  "deckTitle": "String (e.g. Masterclass: Topic Name)",
  "totalSlides": Number,
  "slides": [
    {
      "id": 1,
      "type": "intro | theory | code | points | summary",
      "title": "Slide Title",
      "subtitle": "Short punchy subtitle or key takeaway",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "codeSnippet": "Optional code block string if relevant, else empty string",
      "explanation": "1-2 paragraphs of thorough explanation for this slide",
      "speakerNotes": "Teaching tips and talking points for the professor"
    }
  ]
}
Generate between 5 to 8 well-balanced slides capturing introduction, core concepts, examples/code, and summary.`;

  const prompt = `### DOCUMENT TITLE ###\n${title}\n\n### DOCUMENT CONTENT ###\n${documentText.slice(0, 15000)}\n\nReturn ONLY raw JSON without markdown codeblocks.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating slides from document:', error);
    throw new Error('Failed to generate presentation slides');
  }
};

/**
 * Generate 3 reusable analogies & examples for a given topic
 */
export const generateAIExamples = async (topic) => {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured.");

  const systemInstruction = `You are a Master Professor and Analogy Generator for ProfessorOS.
Your job is to generate 3 creative, memorable real-world analogies, code demonstrations, or case studies for the given technical topic.
Output MUST be a strict JSON array of 3 objects matching this schema:
[
  {
    "title": "String (e.g. Real-world Analogy: ATM Machine for OOP)",
    "description": "Short 1-2 sentence overview of why this example works",
    "category": "Analogy | Code Snippet | Case Study",
    "content": "Detailed markdown explanation or code example ready to teach in class",
    "relatedTopics": ["Tag1", "Tag2"]
  }
]`;

  const prompt = `### TOPIC ###\n${topic}\n\nReturn ONLY raw JSON array without markdown formatting or \`\`\`json blocks.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating AI examples:', error);
    throw new Error('Failed to generate AI examples');
  }
};


