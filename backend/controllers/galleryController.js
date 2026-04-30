import { gallery } from '../db/query.js';

export const getGallery = async (req, res, next) => {
  try {
    const { category, type, page = 1, limit = 20 } = req.query;
    
    const filters = {};
    filters.is_active = true;
    if (category) filters.category = category;
    if (type) filters.type = type;
    if (limit) filters.limit = parseInt(limit);
    
    const result = await gallery.findAll(filters);
    
    res.json({
      success: true,
      items: result.rows,
      totalPages: Math.ceil(result.rows.length / limit),
      currentPage: parseInt(page),
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

export const getGalleryItem = async (req, res, next) => {
  try {
    const result = await gallery.findById(req.params.id);
    const item = result.rows[0];
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const result = await gallery.create(req.body);
    const item = result.rows[0];
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req, res, next) => {
  try {
    const result = await gallery.update(req.params.id, req.body);
    const item = result.rows[0];
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const result = await gallery.delete(req.params.id);
    const item = result.rows[0];
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedGallery = async (req, res, next) => {
  try {
    const result = await gallery.findAll({ is_active: true, is_featured: true, limit: 12 });
    res.json({ success: true, items: result.rows });
  } catch (error) {
    next(error);
  }
};
