import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['Book', 'PDF', 'Research Paper', 'Official Docs', 'Article', 'Video', 'GitHub', 'Blog'],
    required: true
  },
  url: { type: String, required: true },
  relatedTopics: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
