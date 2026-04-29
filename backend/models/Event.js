import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  image: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['cultural', 'deportivo', 'educativo', 'ambiental', 'social', 'recreativo'],
    default: 'social'
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  endDate: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  capacity: {
    type: Number,
    default: 100
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requiresRegistration: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });

export default mongoose.model('Event', eventSchema);

