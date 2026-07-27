import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: false // Optional for now so we can test the UI without a topic
  },
  // Core Concepts
  definition: { type: String, default: '' },
  whyWeNeedIt: { type: String, default: '' },
  problemItSolves: { type: String, default: '' },
  realWorldAnalogy: { type: String, default: '' },
  theory: { type: String, default: '' },
  
  // Technical
  syntax: { type: String, default: '' },
  parameters: { type: String, default: '' },
  lifecycle: { type: String, default: '' },
  flowDiagram: { type: String, default: '' },
  executionSteps: { type: String, default: '' },
  visualExplanation: { type: String, default: '' },
  
  // Examples
  basicExample: { type: String, default: '' },
  intermediateExample: { type: String, default: '' },
  advancedExample: { type: String, default: '' },
  industryExample: { type: String, default: '' },
  
  // Guidelines
  bestPractices: { type: String, default: '' },
  commonMistakes: { type: String, default: '' },
  
  // Assessment
  interviewQuestions: [{ type: String }],
  assignments: [{ type: String }],
  lab: { type: String, default: '' },
  practiceQuestions: [{ type: String }],
  mcqs: [{ type: String }], // Simplified to array of strings for now
  
  // Wrap-up
  summary: { type: String, default: '' },
  revisionNotes: { type: String, default: '' },
  references: [{ type: String }]
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
