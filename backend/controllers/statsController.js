import Project from '../models/Project.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Contact from '../models/Contact.js';
import Gallery from '../models/Gallery.js';

export const getStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      totalEvents,
      totalUsers,
      totalPosts,
      totalContacts,
      totalGallery
    ] = await Promise.all([
      Project.countDocuments({ isActive: true }),
      Event.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Post.countDocuments({ isPublished: true }),
      Contact.countDocuments(),
      Gallery.countDocuments({ isActive: true })
    ]);
    
    const projectsByStatus = await Project.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const upcomingEvents = await Event.countDocuments({
      isActive: true,
      date: { $gte: new Date() }
    });
    
    const totalBeneficiaries = await Project.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$beneficiaries' } } }
    ]);
    
    const recentContacts = await Contact.countDocuments({
      isRead: false,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    res.json({
      success: true,
      stats: {
        totalProjects,
        totalEvents,
        totalUsers,
        totalPosts,
        totalContacts,
        totalGallery,
        upcomingEvents,
        totalBeneficiaries: totalBeneficiaries[0]?.total || 0,
        unreadContacts: recentContacts,
        projectsByStatus: projectsByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      totalEvents,
      totalUsers,
      totalBeneficiaries
    ] = await Promise.all([
      Project.countDocuments({ isActive: true }),
      Event.countDocuments({ isActive: true, date: { $gte: new Date() } }),
      User.countDocuments({ isActive: true }),
      Project.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$beneficiaries' } } }
      ])
    ]);
    
    res.json({
      success: true,
      stats: {
        projectsCompleted: totalProjects,
        eventsUpcoming: totalEvents,
        volunteers: totalUsers,
        peopleHelped: totalBeneficiaries[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
