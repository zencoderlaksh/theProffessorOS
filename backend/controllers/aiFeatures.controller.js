import { 
  generateRecommendations, 
  extractKeywords, 
  detectKnowledgeGaps, 
  buildCourse, 
  generateUniversityMaterial 
} from '../services/ai.service.js';
import { UserProfile } from '../models/UserProfile.model.js';
import { Prompt } from '../models/Prompt.model.js';
import Topic from '../models/Topic.model.js';

// Module 14: Smart Recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { draftText, availableResources } = req.body;
    const recommendations = await generateRecommendations(draftText, availableResources);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Module 15: Auto Linking
export const getKeywords = async (req, res) => {
  try {
    const { text } = req.body;
    const keywords = await extractKeywords(text);
    res.json({ keywords });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Module 16: Knowledge Gap Detection
export const checkKnowledgeGaps = async (req, res) => {
  try {
    const { topic, currentSubtopics } = req.body;
    const missing = await detectKnowledgeGaps(topic, currentSubtopics);
    res.json({ missing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Module 17: Course Builder
export const createCourse = async (req, res) => {
  try {
    const { techStack } = req.body;
    const course = await buildCourse(techStack);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Module 18: University Mode
export const getUniversityMaterial = async (req, res) => {
  try {
    const { semester, subject } = req.body;
    const material = await generateUniversityMaterial(semester, subject);
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Module 12: Relationship Engine (Graph Data)
export const getTopicGraph = async (req, res) => {
  try {
    const topics = await Topic.find().select('title prerequisite');
    
    const nodes = topics.map(t => ({
      id: t._id.toString(),
      data: { label: t.title },
      position: { x: Math.random() * 500, y: Math.random() * 500 }
    }));

    const edges = [];
    topics.forEach(t => {
      t.prerequisite.forEach(p => {
        edges.push({
          id: `e${p.toString()}-${t._id.toString()}`,
          source: p.toString(),
          target: t._id.toString(),
          animated: true
        });
      });
    });

    res.json({ nodes, edges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Module 19: Prompt Library (CRUD)
export const getPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPrompt = async (req, res) => {
  try {
    const newPrompt = new Prompt(req.body);
    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Module 13 & 20: User Profile (Teaching Style & AI Memory)
export const getUserProfile = async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: 'default_user' });
    if (!profile) {
      profile = await UserProfile.create({ userId: 'default_user' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { teachingStyle, aiMemory } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
      { userId: 'default_user' },
      { teachingStyle, aiMemory },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
