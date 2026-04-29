import User from '../models/User.js';
import Project from '../models/Project.js';
import Event from '../models/Event.js';
import Post from '../models/Post.js';
import Gallery from '../models/Gallery.js';
import Contact from '../models/Contact.js';

// Dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const [
      totalUsers,
      newUsers,
      totalProjects,
      totalEvents,
      totalPosts,
      totalContacts,
      unreadContacts,
      recentProjects,
      recentEvents,
      recentPosts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Project.countDocuments({ isActive: true }),
      Event.countDocuments({ isActive: true }),
      Post.countDocuments({ isPublished: true }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Project.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).populate('volunteers', 'name'),
      Event.find({ isActive: true }).sort({ createdAt: -1 }).limit(5),
      Post.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5).populate('author', 'name')
    ]);
    
    res.json({
      success: true,
      dashboard: {
        counts: {
          totalUsers,
          newUsers,
          totalProjects,
          totalEvents,
          totalPosts,
          totalContacts,
          unreadContacts
        },
        recent: {
          projects: recentProjects,
          events: recentEvents,
          posts: recentPosts
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ========== USERS ==========
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await User.countDocuments(query);
    
    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

// ========== PROJECTS ==========
export const getAllProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;
    
    const projects = await Project.find(query)
      .populate('volunteers', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Project.countDocuments(query);
    
    res.json({
      success: true,
      projects,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ========== EVENTS ==========
export const getAllEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const events = await Event.find()
      .populate('attendees.user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Event.countDocuments();
    
    res.json({
      success: true,
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ========== POSTS ==========
export const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Post.countDocuments();
    
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

export const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user.id });
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

// ========== GALLERY ==========
export const getAllGallery = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const items = await Gallery.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Gallery.countDocuments();
    
    res.json({
      success: true,
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ========== CONTACTS ==========
export const getAllContacts = async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (isRead !== undefined) query.isRead = isRead === 'true';
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      contacts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const markContactAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
