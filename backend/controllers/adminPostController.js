import Joi from 'joi';
import { posts } from '../db/query.js';
import pool from '../config/database.js';
import upload from '../middleware/upload.js';
import supabase from '../lib/supabase.js';

export const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    let query = `SELECT * FROM posts WHERE is_published = true`;
    const params = [];
    let paramCount = 1;
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    const countResult = await pool.query(`SELECT COUNT(*) FROM posts WHERE is_published = true`);
    const count = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true,
      posts: result.rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const adminCreatePost = async (req, res, next) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const createPostSchema = Joi.object({
        title: Joi.string().min(3).max(255).required().label('Título'),
        content: Joi.string().min(10).required().label('Contenido'),
        excerpt: Joi.string().max(200).label('Extracto'),
        category: Joi.string().max(50).default('blog').label('Categoría'),
        tags: Joi.string().label('Tags (comma separated)'),
        is_published: Joi.boolean().default(true).label('Publicado'),
        is_featured: Joi.boolean().default(false).label('Destacado')
      });

      const { error: validationError, value: validatedData } = createPostSchema.validate(req.body, { abortEarly: false });
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError.details.map(d => d.message).join(', ') });
      }

      let image_url = '';
      if (supabase && req.file) {
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `posts/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
          
        if (error) {
          return res.status(500).json({ success: false, message: 'Image upload failed' });
        }
        
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        image_url = publicUrl;
      }

      const postData = {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt || validatedData.content.substring(0, 200),
        image: image_url,
        category: validatedData.category,
        tags: validatedData.tags ? validatedData.tags.split(',').map(t => t.trim()) : [],
        is_published: validatedData.is_published,
        is_featured: validatedData.is_featured,
        author_id: req.user.id,
        slug: validatedData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      };

      const result = await posts.create(postData);
      const post = result.rows[0];

      res.status(201).json({ success: true, post });
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdatePost = async (req, res, next) => {
  try {
    const result = await posts.findById(req.params.id);
    const post = result.rows[0];
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const updatePostSchema = Joi.object({
        title: Joi.string().min(3).max(255).required().label('Título'),
        content: Joi.string().min(10).required().label('Contenido'),
        excerpt: Joi.string().max(200).label('Extracto'),
        category: Joi.string().max(50).label('Categoría'),
        tags: Joi.string().label('Tags'),
        is_published: Joi.boolean().label('Publicado'),
        is_featured: Joi.boolean().label('Destacado')
      });

      const { error: validationError, value: validatedData } = updatePostSchema.validate(req.body, { abortEarly: false });
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError.details.map(d => d.message).join(', ') });
      }

      let image_url = post.image;
      if (supabase && req.file) {
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `posts/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
          
        if (error) {
          return res.status(500).json({ success: false, message: 'Image upload failed' });
        }
        
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        image_url = publicUrl;
      }

      const postData = {
        ...validatedData,
        image: image_url,
        tags: validatedData.tags ? validatedData.tags.split(',').map(t => t.trim()) : post.tags,
        slug: validatedData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      };

      const updateResult = await posts.update(req.params.id, postData);
      const updatedPost = updateResult.rows[0];

      res.json({ success: true, post: updatedPost });
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeletePost = async (req, res, next) => {
  try {
    const result = await posts.findById(req.params.id);
    const post = result.rows[0];
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    await posts.delete(req.params.id);
    
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

