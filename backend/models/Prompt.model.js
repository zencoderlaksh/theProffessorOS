import mongoose from 'mongoose';

const PromptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  isReusable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Prompt = mongoose.model('Prompt', PromptSchema);
