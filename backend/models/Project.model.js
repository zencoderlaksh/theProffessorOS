import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  technology: [{ type: String }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  estimatedHours: { type: Number, default: 0 },
  githubUrl: { type: String, default: '' },
  screenshots: [{ type: String }],
  flowDiagram: { type: String, default: '' },
  architecture: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
