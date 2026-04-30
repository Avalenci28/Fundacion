import { posts } from '../db/query.js';
import pool from '../config/database.js';

export const getPosts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, search, tag } = req.query;
    
    let query = `SELECT p.*, u.name as author_name, u.avatar as author_avatar 
               FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE is_published = true`;
    const params = [];
    let paramCount = 1;
    
    if (category) {
      query += ` AND category = $${paramCount++}`;
      params.push(category);
    }
    if (search) {
      query += ` AND (title ILIKE $${paramCount++} OR content ILIKE $${paramCount++})`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC`;
    query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    // Get total count
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

export const getPost = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as author_name, u.avatar as author_avatar 
       FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.slug = $1`,
      [req.params.slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Increment views
    await pool.query(`UPDATE posts SET views = views + 1 WHERE slug = $1`, [req.params.slug]);
    
    res.json({ success: true, post: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    
    const result = await posts.create({
      ...req.body,
      author_id: req.user.id,
      slug
    });
    
    const post = result.rows[0];
    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const result = await posts.update(req.params.id, req.body);
    const post = result.rows[0];
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await pool.query(`UPDATE posts SET is_published = false WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    // Get current post
    const postResult = await posts.findById(req.params.id);
    const post = postResult.rows[0];
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Parse comments and add new one
    const comments = JSON.parse(post.comments || '[]');
    comments.push({
      user: req.user.id,
      text: req.body.text,
      created_at: new Date().toISOString()
    });
    
    await pool.query(
      `UPDATE posts SET comments = $1, updated_at = NOW() WHERE id = $2`,
      [JSON.stringify(comments), req.params.id]
    );
    
    res.json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const postResult = await posts.findById(req.params.id);
    const post = postResult.rows[0];
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Parse likes and toggle
    const likes = JSON.parse(post.likes || '[]');
    const likeIndex = likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      likes.splice(likeIndex, 1);
    } else {
      likes.push(req.user.id);
    }
    
    await pool.query(
      `UPDATE posts SET likes = $1, updated_at = NOW() WHERE id = $2`,
      [JSON.stringify(likes), req.params.id]
    );
    
    res.json({ success: true, likes: likes.length });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedPosts = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as author_name, u.avatar as author_avatar 
       FROM posts p LEFT JOIN users u ON p.author_id = u.id 
       WHERE p.is_published = true AND p.is_featured = true 
       ORDER BY p.created_at DESC LIMIT 6`
    );
    res.json({ success: true, posts: result.rows });
  } catch (error) {
    next(error);
  }
};
