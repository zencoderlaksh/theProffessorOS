import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  prerequisite: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedLectureTime: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  tags: [{
    type: String
  }]
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
