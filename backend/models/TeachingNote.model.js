import mongoose from 'mongoose';

const teachingNoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isPrivate: { type: Boolean, default: true },
  relatedTopics: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('TeachingNote', teachingNoteSchema);
