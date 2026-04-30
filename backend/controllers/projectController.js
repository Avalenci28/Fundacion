import { projects } from '../db/query.js';
import pool from '../config/database.js';

export const getProjects = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 10, search } = req.query;
    
    let query = `SELECT * FROM projects WHERE is_active = true`;
    const params = [];
    let paramCount = 1;
    
    if (status) {
      query += ` AND status = $${paramCount++}`;
      params.push(status);
    }
    if (category) {
      query += ` AND category = $${paramCount++}`;
      params.push(category);
    }
    if (search) {
      query += ` AND (title ILIKE $${paramCount++} OR description ILIKE $${paramCount++})`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC`;
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = `SELECT COUNT(*) FROM projects WHERE is_active = true`;
    if (status) {
      countQuery += ` AND status = $1`;
    }
    const countResult = await pool.query(countQuery, status ? [status] : []);
    const count = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      projects: result.rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const result = await projects.findById(req.params.id);
    const project = result.rows[0];
    
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
    const result = await projects.create(req.body);
    const project = result.rows[0];
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const result = await projects.update(req.params.id, req.body);
    const project = result.rows[0];
    
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
    const result = await projects.delete(req.params.id);
    const project = result.rows[0];
    
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
    // Get current project
    const projResult = await projects.findById(req.params.id);
    const project = projResult.rows[0];
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Parse volunteers array and check if already joined
    const volunteers = JSON.parse(project.volunteers || '[]');
    if (volunteers.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already joined this project' });
    }
    
    // Add volunteer
    volunteers.push({ id: req.user.id, joinedAt: new Date().toISOString() });
    
    await pool.query(
      `UPDATE projects SET volunteers = $1, updated_at = NOW() WHERE id = $2`,
      [JSON.stringify(volunteers), req.params.id]
    );
    
    res.json({ success: true, message: 'Joined project successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProjects = async (req, res, next) => {
  try {
    const result = await projects.findAll({ is_active: true, is_featured: true, limit: 6 });
    res.json({ success: true, projects: result.rows });
  } catch (error) {
    next(error);
  }
};

