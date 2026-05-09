import pool from '../config/database.js';
import { users, contacts } from '../db/query.js';
import Joi from 'joi';

export const getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsersResult,
      totalProjectsResult,
      totalEventsResult,
      totalPostsResult,
      totalContactsResult,
      unreadContactsResult
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE is_active = true'),
      pool.query('SELECT COUNT(*) FROM projects WHERE is_active = true'),
      pool.query('SELECT COUNT(*) FROM events WHERE is_active = true'),
      pool.query('SELECT COUNT(*) FROM posts WHERE is_published = true'),
      pool.query('SELECT COUNT(*) FROM contacts'),
      pool.query('SELECT COUNT(*) FROM contacts WHERE is_read = false')
    ]);

    const counts = {
      totalUsers: parseInt(totalUsersResult.rows[0].count),
      totalProjects: parseInt(totalProjectsResult.rows[0].count),
      totalEvents: parseInt(totalEventsResult.rows[0].count),
      totalPosts: parseInt(totalPostsResult.rows[0].count),
      totalContacts: parseInt(totalContactsResult.rows[0].count),
      unreadContacts: parseInt(unreadContactsResult.rows[0].count)
    };

    res.json({
      success: true,
      dashboard: {
        counts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Users
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    
    let query = 'SELECT * FROM users WHERE is_active = true';
    const params = [];
    let paramCount = 1;
    
    if (search) {
      query += ` AND (name ILIKE $${paramCount++} OR email ILIKE $${paramCount++})`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role) {
      query += ` AND role = $${paramCount++}`;
      params.push(role);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    const countQuery = 'SELECT COUNT(*) FROM users WHERE is_active = true';
    const countParams = [];
    if (search) {
      countQuery += ` AND (name ILIKE $${countParams.length + 1} OR email ILIKE $${countParams.length + 2})`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (role) {
      countQuery += ` AND role = $${countParams.length + 1}`;
      countParams.push(role);
    }
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      success: true,
      users: result.rows,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit)),
      currentPage: parseInt(page),
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updateUserSchema = Joi.object({
      name: Joi.string().min(2).max(100).label('Nombre'),
      email: Joi.string().email().label('Email'),
      role: Joi.string().valid('user', 'admin', 'volunteer').label('Rol'),
      is_active: Joi.boolean().label('Activo')
    }).min(1);

    const { error: validationError, value: validatedData } = updateUserSchema.validate(req.body, { abortEarly: false });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError.details.map(d => d.message).join(', ') });
    }

    const result = await users.update(req.params.id, validatedData);
    const user = result.rows[0];

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
    const result = await users.update(req.params.id, { is_active: false });
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

// Contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, is_read } = req.query;
    
    let query = `SELECT * FROM contacts`;
    const params = [];
    let paramCount = 1;
    
    if (is_read !== undefined) {
      query += ` WHERE is_read = $${paramCount++}`;
      params.push(is_read === 'true');
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    const countQuery = `SELECT COUNT(*) FROM contacts${is_read !== undefined ? ` WHERE is_read = $${1}` : ''}`;
    const countParams = is_read !== undefined ? [is_read === 'true'] : [];
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      success: true,
      contacts: result.rows,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit)),
      currentPage: parseInt(page),
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
};

export const markContactAsRead = async (req, res, next) => {
  try {
    const result = await contacts.findById(req.params.id);
    const contact = result.rows[0];
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    const updateResult = await contacts.update(req.params.id, { is_read: true, updated_at: new Date() });
    const updatedContact = updateResult.rows[0];

    res.json({ success: true, contact: updatedContact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const result = await contacts.findById(req.params.id);
    const contact = result.rows[0];
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    await contacts.delete(req.params.id);
    
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};

