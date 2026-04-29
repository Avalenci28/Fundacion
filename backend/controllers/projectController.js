import Project from '../models/Project.js';

export const getProjects = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 10, search } = req.query;
    const query = { isActive: true };
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const projects = await Project.find(query)
      .populate('volunteers', 'name avatar')
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

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('volunteers', 'name avatar');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, project });
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

export const joinProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    if (project.volunteers.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already joined this project' });
    }
    
    project.volunteers.push(req.user.id);
    await project.save();
    
    res.json({ success: true, message: 'Joined project successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

