import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  image: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['noticia', 'blog', 'actividad', 'historia'],
    default: 'blog'
  },
  tags: [String],
  comments: [commentSchema],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

postSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

postSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model('Post', postSchema);

