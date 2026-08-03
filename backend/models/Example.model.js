import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false
  },
  category: {
    type: String,
    enum: ['Analogy', 'Code Snippet', 'Case Study', 'General'],
    default: 'Analogy'
  },
  relatedTopics: [{
    type: String
  }]
}, { timestamps: true });

const Example = mongoose.model('Example', exampleSchema);

export default Example;
