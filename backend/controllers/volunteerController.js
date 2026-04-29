import User from '../models/User.js';
import Project from '../models/Project.js';

export const getVolunteers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const volunteers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await User.countDocuments(query);
    
    res.json({
      success: true,
      volunteers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getVolunteerProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const projects = await Project.find({ volunteers: req.user.id, isActive: true })
      .select('title status image');
    
    res.json({
      success: true,
      profile: {
        ...user.toObject(),
        projects
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerInfo = async (req, res, next) => {
  try {
    const { skills, availability, experience } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        volunteerInfo: {
          skills: skills || [],
          availability: availability || [],
          experience: experience || ''
        }
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
