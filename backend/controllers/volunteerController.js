import { users } from '../db/query.js';
import { projects } from '../db/query.js';
import pool from '../config/database.js';

export const getVolunteers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    let query = `SELECT * FROM users WHERE is_active = true`;
    const params = [];
    let paramCount = 1;
    
    if (search) {
      query += ` AND (name ILIKE $${paramCount++} OR email ILIKE $${paramCount++})`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    const countQuery = `SELECT COUNT(*) FROM users WHERE is_active = true`;
    if (search) {
      countQuery += ` AND (name ILIKE $1 OR email ILIKE $1)`;
    }
    const countParams = search ? [`%${search}%`] : [];
    const countResult = await pool.query(countQuery, countParams);
    const count = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      volunteers: result.rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getVolunteerProfile = async (req, res, next) => {
  try {
    const result = await users.findById(req.user.id);
    const user = result.rows[0];
    
    const projResult = await pool.query(
      `SELECT title, status, image FROM projects WHERE volunteers @> $1 AND is_active = true`,
      [JSON.stringify([{id: req.user.id}])]
    );
    
    res.json({
      success: true,
      profile: {
        ...user,
        projects: projResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerInfo = async (req, res, next) => {
  try {
    const { skills, availability, experience } = req.body;
    
    const volunteerInfo = {
      skills: skills || [],
      availability: availability || [],
      experience: experience || ''
    };
    
    const result = await users.update(req.user.id, { volunteer_info: JSON.stringify(volunteerInfo) });
    const user = result.rows[0];
    
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
