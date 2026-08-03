import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: 'default_user' // Hardcoded for single-user ProfessorOS
  },
  teachingStyle: {
    type: String,
    default: 'I prefer clear explanations with practical examples.'
  },
  aiMemory: [{
    type: String
  }]
}, {
  timestamps: true
});

export const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
