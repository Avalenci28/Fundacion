import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isReplied: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

contactSchema.index({ isRead: 1, createdAt: -1 });

export default mongoose.model('Contact', contactSchema);

