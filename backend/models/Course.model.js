import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#FF5D73'
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;
