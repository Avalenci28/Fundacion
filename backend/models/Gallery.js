import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  url: {
    type: String,
    required: [true, 'URL is required']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  category: {
    type: String,
    enum: ['evento', 'proyecto', 'comunidad', 'voluntariado', 'otro'],
    default: 'otro'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

gallerySchema.index({ category: 1, createdAt: -1 });

export default mongoose.model('Gallery', gallerySchema);

