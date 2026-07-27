import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topicId: { type: String, required: true }, // Would be ObjectId in production
  duration: { type: Number, required: true }, // minutes
  objectives: { type: String, default: '' },
  activities: { type: String, default: '' },
  examples: [{ type: String }],
  assignments: [{ type: String }],
  homework: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Lecture', lectureSchema);
