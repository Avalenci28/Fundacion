import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
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
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  gallery: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Completado', 'En proceso', 'Próximamente'],
    default: 'Próximamente'
  },
  category: {
    type: String,
    enum: ['social', 'ambiental', 'educativo', 'cultural', 'deportivo'],
    default: 'social'
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    default: ''
  },
  beneficiaries: {
    type: Number,
    default: 0
  },
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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

projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ category: 1 });

export default mongoose.model('Project', projectSchema);

