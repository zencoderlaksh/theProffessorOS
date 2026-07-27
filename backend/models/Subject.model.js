import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  estimatedTeachingHours: {
    type: Number,
    default: 0
  },
  semester: {
    type: String,
    default: '1'
  }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
