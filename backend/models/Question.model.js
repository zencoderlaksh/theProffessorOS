import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ['University Questions', 'Previous Papers', 'Frequently Asked', 'Interview Questions', 'MCQs', 'Coding Problems'],
    required: true
  },
  answer: { type: String, default: '' },
  relatedTopics: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
