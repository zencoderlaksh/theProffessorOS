import mongoose from 'mongoose';

const analogySchema = new mongoose.Schema({
  concept: { type: String, required: true },
  analogy: { type: String, required: true },
  description: { type: String, default: '' },
  relatedTopics: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Analogy', analogySchema);
