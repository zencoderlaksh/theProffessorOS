import mongoose from 'mongoose';

const personalChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  rssUrl: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    default: 'General Tech'
  }
}, { timestamps: true });

export default mongoose.model('PersonalChannel', personalChannelSchema);
