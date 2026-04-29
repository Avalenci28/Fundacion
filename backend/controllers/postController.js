import Post from '../models/Post.js';

export const getPosts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, search, tag } = req.query;
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Post.countDocuments(query);
    
    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
      
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user.id
    });
    await post.populate('author', 'name avatar');
    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { isPublished: false }, { new: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    post.comments.push({
      user: req.user.id,
      text: req.body.text
    });
    
    await post.save();
    await post.populate('comments.user', 'name avatar');
    
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }
    
    await post.save();
    res.json({ success: true, likes: post.likes.length });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ isPublished: true, isFeatured: true })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};
