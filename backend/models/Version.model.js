import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  itemType: { type: String, required: true },
  itemId: { type: String, required: true },
  snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  author: { type: String, default: 'Professor' }
}, { timestamps: true });

export default mongoose.model('Version', versionSchema);
