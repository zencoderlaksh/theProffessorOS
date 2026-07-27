import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  relatedTopics: [{
    type: String // We use strings for tags for now (e.g. "Java OOP", "Python OOP", "Classes")
  }]
}, { timestamps: true });

const Example = mongoose.model('Example', exampleSchema);

export default Example;
