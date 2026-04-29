import Gallery from '../models/Gallery.js';

export const getGallery = async (req, res, next) => {
  try {
    const { category, type, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (type) query.type = type;
    
    const items = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Gallery.countDocuments(query);
    
    res.json({
      success: true,
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
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
    const item = await Gallery.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
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
    const item = await Gallery.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
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
    const items = await Gallery.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(12);
    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
};
