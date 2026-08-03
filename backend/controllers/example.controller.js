import { syncToVectorDB } from '../utils/vectorSync.js';
import Example from '../models/Example.model.js';
import { generateAIExamples } from '../services/ai.service.js';

export const getExamples = async (req, res) => {
  try {
    const { courseId, search, category } = req.query;
    const query = {};

    if (courseId) {
      query.courseId = courseId;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { relatedTopics: { $regex: search, $options: 'i' } }
      ];
    }

    const examples = await Example.find(query).populate('courseId').sort({ createdAt: -1 });
    res.status(200).json(examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createExample = async (req, res) => {
  try {
    const { title, description, content, courseId, category, relatedTopics } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Example title is required' });
    }

    const newItem = new Example({
      title,
      description,
      content,
      courseId: courseId || null,
      category: category || 'Analogy',
      relatedTopics: relatedTopics || []
    });

    await newItem.save();
    syncToVectorDB(newItem, 'EXAMPLE');
    res.status(201).json({ message: 'Example saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExample = async (req, res) => {
  try {
    const { id } = req.params;
    await Example.findByIdAndDelete(id);
    res.status(200).json({ message: 'Example deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateAIExamplesController = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required for AI generation' });
    }

    const generated = await generateAIExamples(topic);
    res.status(200).json({ examples: generated });
  } catch (error) {
    console.error('Error generating AI examples controller:', error);
    res.status(500).json({ error: error.message || 'AI Example generation failed' });
  }
};
