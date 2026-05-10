import Joi from 'joi';
import { gallery } from '../db/query.js';
import pool from '../config/database.js';
import upload from '../middleware/upload.js';
import supabase from '../lib/supabase.js';

export const getAllGallery = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    
    let query = `SELECT * FROM gallery WHERE is_active = true`;
    const params = [];
    let paramCount = 1;
    
    if (category) {
      query += ` AND category = $${paramCount++}`;
      params.push(category);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    const countQuery = `SELECT COUNT(*) FROM gallery WHERE is_active = true${category ? ` AND category = $${paramCount}` : ''}`;
    const countParams = category ? [category] : [];
    const countResult = await pool.query(countQuery, countParams);
    const count = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      gallery: result.rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const adminCreateGalleryItem = async (req, res, next) => {
  // Multer upload middleware - handles multipart/form-data
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const createGallerySchema = Joi.object({
        title: Joi.string().min(3).max(255).required().label('Título'),
        description: Joi.string().max(1000).label('Descripción'),
        category: Joi.string().max(50).default('otro').label('Categoría'),
        project_id: Joi.number().label('Project ID'),
        event_id: Joi.number().label('Event ID'),
        is_featured: Joi.alternatives().try(
          Joi.boolean(),
          Joi.string().valid('true', 'false')
        ).default(false).label('Destacado')
      });

      const { error: validationError, value: validatedData } = createGallerySchema.validate(req.body, { abortEarly: false });
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError.details.map(d => d.message).join(', ') });
      }

      let image_url = '';
      if (supabase && req.file) {
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `gallery/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

        if (error) {
          console.error('Supabase upload error:', error);
          return res.status(500).json({ success: false, message: 'Image upload failed: ' + error.message });
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        image_url = publicUrl;
      }

      const itemData = {
        title: validatedData.title,
        description: validatedData.description || '',
        url: image_url,
        thumbnail: image_url,
        type: 'image',
        category: validatedData.category,
        project_id: validatedData.project_id,
        event_id: validatedData.event_id,
        is_active: true,
        is_featured: validatedData.is_featured
      };

      const result = await gallery.create(itemData);
      const item = result.rows[0];

      res.status(201).json({ success: true, item });
    } catch (error) {
      console.error('Gallery create error:', error);
      res.status(500).json({ success: false, message: 'Image upload failed: ' + error.message });
    }
  });
};

export const adminUpdateGalleryItem = async (req, res, next) => {
  // First find the gallery item
  try {
    const result = await gallery.findById(req.params.id);
    const item = result.rows[0];

    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    // Multer upload middleware - handles multipart/form-data
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      try {
        const updateGallerySchema = Joi.object({
          title: Joi.string().min(3).max(255).required().label('Título'),
          description: Joi.string().max(1000).label('Descripción'),
          category: Joi.string().max(50).label('Categoría'),
          project_id: Joi.number().label('Project ID'),
          event_id: Joi.number().label('Event ID'),
          is_featured: Joi.alternatives().try(
            Joi.boolean(),
            Joi.string().valid('true', 'false')
          ).label('Destacado')
        });

        const { error: validationError, value: validatedData } = updateGallerySchema.validate(req.body, { abortEarly: false });
        if (validationError) {
          return res.status(400).json({ success: false, message: validationError.details.map(d => d.message).join(', ') });
        }

        let image_url = item.url;
        if (supabase && req.file) {
          const fileExt = req.file.originalname.split('.').pop();
          const fileName = `gallery/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

          if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).json({ success: false, message: 'Image upload failed: ' + error.message });
          }

          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
          image_url = publicUrl;
        }

        const itemData = {
          ...validatedData,
          url: image_url,
          thumbnail: image_url
        };

        const updateResult = await gallery.update(req.params.id, itemData);
        const updatedItem = updateResult.rows[0];

        res.json({ success: true, item: updatedItem });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteGalleryItem = async (req, res, next) => {
  try {
    const result = await gallery.findById(req.params.id);
    const item = result.rows[0];
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    await gallery.delete(req.params.id);
    
    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

