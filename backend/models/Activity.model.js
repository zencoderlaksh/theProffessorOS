import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  action: { type: String, enum: ['Edited', 'Opened', 'Added'], required: true },
  itemType: { type: String, required: true },
  itemId: { type: String, required: true },
  itemTitle: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
