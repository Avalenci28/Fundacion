import Joi from 'joi';
import { events } from '../db/query.js';
import pool from '../config/database.js';
import upload from '../middleware/upload.js';
import supabase from '../lib/supabase.js';

export const getAllEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    let query = `SELECT * FROM events WHERE is_active = true`;
    const params = [];
    let paramCount = 1;
    
    query += ` ORDER BY date DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    const countResult = await pool.query(`SELECT COUNT(*) FROM events WHERE is_active = true`);
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

export const adminCreateEvent = async (req, res, next) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const createEventSchema = Joi.object({
        title: Joi.string().min(3).max(200).required().label('Título'),
        description: Joi.string().min(10).max(2000).required().label('Descripción'),
        date: Joi.date().iso().required().label('Fecha'),
        type: Joi.string().max(50).required().label('Tipo'),
        capacity: Joi.number().integer().min(1).max(10000).required().label('Capacidad'),
        location: Joi.string().max(200).required().label('Ubicación'),
        end_date: Joi.date().iso().label('Fecha fin'),
        is_featured: Joi.boolean().default(false).label('Destacado')
      });

      const { error: validationError, value: validatedData } = createEventSchema.validate(req.body, { abortEarly: false });
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError.details.map(d => d.message).join(', ') });
      }

      const { title, description, date, type, capacity, location, end_date, is_featured } = validatedData;

      let image_url = '';
      if (supabase && req.file) {
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `events/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
          
        if (error) {
          return res.status(500).json({ success: false, message: 'Image upload failed' });
        }
        
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        image_url = publicUrl;
      }

      const eventData = {
        title,
        description,
        date,
        type,
        capacity,
        location,
        end_date,
        image: image_url,
        is_active: true,
        is_featured,
        requires_registration: true
      };

      const result = await events.create(eventData);
      const event = result.rows[0];

      res.status(201).json({ success: true, event });
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateEvent = async (req, res, next) => {
  try {
    const result = await events.findById(req.params.id);
    const event = result.rows[0];
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const updateEventSchema = Joi.object({
        title: Joi.string().min(3).max(200).required().label('Título'),
        description: Joi.string().min(10).max(2000).required().label('Descripción'),
        date: Joi.date().iso().required().label('Fecha'),
        type: Joi.string().max(50).required().label('Tipo'),
        capacity: Joi.number().integer().min(1).max(10000).required().label('Capacidad'),
        location: Joi.string().max(200).required().label('Ubicación'),
        end_date: Joi.date().iso().label('Fecha fin'),
        is_featured: Joi.boolean().label('Destacado')
      });

      const { error: validationError, value: validatedData } = updateEventSchema.validate(req.body, { abortEarly: false });
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError.details.map(d => d.message).join(', ') });
      }

      let image_url = event.image;
      if (supabase && req.file) {
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `events/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
          
        if (error) {
          return res.status(500).json({ success: false, message: 'Image upload failed' });
        }
        
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        image_url = publicUrl;
      }

      const eventData = {
        ...validatedData,
        image: image_url,
        capacity: Number(validatedData.capacity)
      };

      const updateResult = await events.update(req.params.id, eventData);
      const updatedEvent = updateResult.rows[0];

      res.json({ success: true, event: updatedEvent });
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteEvent = async (req, res, next) => {
  try {
    const result = await events.findById(req.params.id);
    const event = result.rows[0];
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await events.delete(req.params.id);
    
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
