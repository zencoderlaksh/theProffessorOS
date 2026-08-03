import Lecture from '../models/Lecture.model.js';
import Lesson from '../models/Lesson.model.js';
import { syncToVectorDB } from '../utils/vectorSync.js';
import { generateEmbedding, generateLessonPlan, generateSlidesFromDocument } from '../services/ai.service.js';
import { querySimilar } from '../services/vector.service.js';
import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

export const createLecture = async (req, res) => {
  try {
    const newItem = new Lecture(req.body);
    await newItem.save();
    syncToVectorDB(newItem, 'LECTURE');
    res.status(201).json({ message: 'Lecture saved successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateLecture = async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required to generate a lecture.' });
    }

    const topicVector = await generateEmbedding(topic);
    let contextItems = [];

    if (topicVector && topicVector.length > 0) {
      const matches = await querySimilar(topicVector, 10);
      if (matches && matches.length > 0) {
        contextItems = matches.map(match => ({
          type: match.metadata.type,
          title: match.metadata.title,
          content: match.metadata.content
        }));
      }
    }

    const generatedPlan = await generateLessonPlan(topic, contextItems);
    res.json({ plan: generatedPlan, sources: contextItems });
  } catch (error) {
    console.error('Error in generateLecture:', error);
    res.status(500).json({ error: error.message });
  }
};

export const generateSlidesFromLesson = async (req, res) => {
  try {
    const { lessonId } = req.body;
    if (!lessonId) {
      return res.status(400).json({ error: 'Lesson ID is required' });
    }

    const lesson = await Lesson.findById(lessonId).populate('courseId');
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson document not found' });
    }

    const relativeFilePath = lesson.fileUrl.replace('/uploads/', '');
    const absoluteFilePath = path.join(process.cwd(), 'uploads', relativeFilePath);

    if (!fs.existsSync(absoluteFilePath)) {
      return res.status(404).json({ error: 'Physical file not found on server' });
    }

    let extractedText = '';
    const ext = path.extname(absoluteFilePath).toLowerCase();

    if (ext === '.pdf') {
      try {
        const dataBuffer = fs.readFileSync(absoluteFilePath);
        const parser = new PDFParse({ data: dataBuffer });
        await parser.load();
        const pdfTextObj = await parser.getText();
        extractedText = typeof pdfTextObj === 'string' ? pdfTextObj : pdfTextObj.text || '';
      } catch (pdfErr) {
        console.warn('PDF parsing warning, using fallback text:', pdfErr);
      }
    } else {
      extractedText = fs.readFileSync(absoluteFilePath, 'utf8');
    }

    if (!extractedText || !extractedText.trim()) {
      extractedText = `Title: ${lesson.title}. Course: ${lesson.courseId?.name || ''}. Notes: ${lesson.notes || ''}`;
    }

    const presentationDeck = await generateSlidesFromDocument(extractedText, lesson.title);

    res.json({
      lesson,
      deck: presentationDeck
    });
  } catch (error) {
    console.error('Error in generateSlidesFromLesson:', error);
    res.status(500).json({ error: error.message || 'Failed to parse document or generate slides' });
  }
};
