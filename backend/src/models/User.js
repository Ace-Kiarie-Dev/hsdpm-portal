import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['member', 'dept_head', 'overseer'],
    default: 'member',
  },
  department: {
    type: String,
    enum: ['Sound', 'Media', 'Streaming', 'Equipment', 'General'],
    default: 'General',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', function () {
  this.updatedAt = new Date();
});

const User = mongoose.model('User', userSchema);
export default User;
