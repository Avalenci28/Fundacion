import pool from '../config/database.js';

export const getStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      totalEvents,
      totalUsers,
      totalPosts,
      totalContacts,
      totalGallery,
      upcomingEvents,
      unreadContacts
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM projects WHERE is_active = true`),
      pool.query(`SELECT COUNT(*) FROM events WHERE is_active = true`),
      pool.query(`SELECT COUNT(*) FROM users WHERE is_active = true`),
      pool.query(`SELECT COUNT(*) FROM posts WHERE is_published = true`),
      pool.query(`SELECT COUNT(*) FROM contacts`),
      pool.query(`SELECT COUNT(*) FROM gallery WHERE is_active = true`),
      pool.query(`SELECT COUNT(*) FROM events WHERE is_active = true AND date >= NOW()`),
      pool.query(`SELECT COUNT(*) FROM contacts WHERE is_read = false`)
    ]);
    
    const projectsByStatus = await pool.query(
      `SELECT status, COUNT(*) as count FROM projects WHERE is_active = true GROUP BY status`
    );
    
    const beneficiaries = await pool.query(
      `SELECT SUM(beneficiaries) as total FROM projects WHERE is_active = true`
    );
    
    const statusObj = {};
    projectsByStatus.rows.forEach(row => {
      statusObj[row.status] = parseInt(row.count);
    });
    
    res.json({
      success: true,
      stats: {
        totalProjects: parseInt(totalProjects.rows[0].count),
        totalEvents: parseInt(totalEvents.rows[0].count),
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalPosts: parseInt(totalPosts.rows[0].count),
        totalContacts: parseInt(totalContacts.rows[0].count),
        totalGallery: parseInt(totalGallery.rows[0].count),
        upcomingEvents: parseInt(upcomingEvents.rows[0].count),
        totalBeneficiaries: parseInt(beneficiaries.rows[0].total) || 0,
        unreadContacts: parseInt(unreadContacts.rows[0].count),
        projectsByStatus: statusObj
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
      upcomingEvents,
      totalUsers,
      beneficiaries
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM projects WHERE is_active = true`),
      pool.query(`SELECT COUNT(*) FROM events WHERE is_active = true AND date >= NOW()`),
      pool.query(`SELECT COUNT(*) FROM users WHERE is_active = true`),
      pool.query(`SELECT SUM(beneficiaries) as total FROM projects WHERE is_active = true`)
    ]);
    
    res.json({
      success: true,
      stats: {
        projectsCompleted: parseInt(totalProjects.rows[0].count),
        eventsUpcoming: parseInt(upcomingEvents.rows[0].count),
        volunteers: parseInt(totalUsers.rows[0].count),
        peopleHelped: parseInt(beneficiaries.rows[0].total) || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
