import mongoose from 'mongoose';

const codeSnippetSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: false // Optional for testing
  },
  snippets: [{
    type: String, // Can store the actual code
    required: true
  }],
  language: {
    type: String,
    required: true,
    default: 'javascript'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  expectedOutput: {
    type: String,
    default: ''
  },
  explanation: {
    type: String,
    default: ''
  },
  complexity: {
    type: String,
    default: '' // e.g. O(N) Time, O(1) Space
  },
  dryRun: {
    type: String,
    default: ''
  },
  isEditable: {
    type: Boolean,
    default: false
  },
  allowDownload: {
    type: Boolean,
    default: true
  },
  allowCopy: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

export default CodeSnippet;
