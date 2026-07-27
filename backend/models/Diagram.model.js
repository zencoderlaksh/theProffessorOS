import mongoose from 'mongoose';

const diagramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['PNG', 'SVG', 'Draw.io', 'Mermaid', 'Excalidraw'],
    required: true
  },
  contentUrl: { type: String, required: true },
  relatedTopics: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Diagram', diagramSchema);
