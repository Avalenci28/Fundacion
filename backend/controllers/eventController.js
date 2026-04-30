import { events } from '../db/query.js';
import pool from '../config/database.js';

export const getEvents = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 10, upcoming, search } = req.query;
    
    let query = `SELECT * FROM events WHERE is_active = true`;
    const params = [];
    let paramCount = 1;
    
    if (type) {
      query += ` AND type = $${paramCount++}`;
      params.push(type);
    }
    if (upcoming === 'true') {
      query += ` AND date >= NOW()`;
    }
    if (search) {
      query += ` AND (title ILIKE $${paramCount++} OR description ILIKE $${paramCount++})`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY date ASC`;
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = `SELECT COUNT(*) FROM events WHERE is_active = true`;
    const countResult = await pool.query(countQuery);
    const count = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      events: result.rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const result = await events.findById(req.params.id);
    const event = result.rows[0];
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const result = await events.create(req.body);
    const event = result.rows[0];
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const result = await events.update(req.params.id, req.body);
    const event = result.rows[0];
    
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
    const result = await events.delete(req.params.id);
    const event = result.rows[0];
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    // Get current event
    const eventResult = await events.findById(req.params.id);
    const event = eventResult.rows[0];
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Parse attendees array and check if already registered
    const attendees = JSON.parse(event.attendees || '[]');
    const alreadyRegistered = attendees.find(a => a.user === req.user.id);
    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }
    
    if (attendees.length >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }
    
    // Add attendee
    attendees.push({ user: req.user.id, registeredAt: new Date().toISOString() });
    
    await pool.query(
      `UPDATE events SET attendees = $1, updated_at = NOW() WHERE id = $2`,
      [JSON.stringify(attendees), req.params.id]
    );
    
    res.json({ success: true, message: 'Registered for event successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedEvents = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM events WHERE is_active = true AND is_featured = true AND date >= NOW() ORDER BY date ASC LIMIT 6`
    );
    res.json({ success: true, events: result.rows });
  } catch (error) {
    next(error);
  }
};

