import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['Theory', 'Coding', 'Lab', 'Mini Project', 'Case Study', 'MCQ'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  content: { type: String, required: true },
  relatedTopics: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
