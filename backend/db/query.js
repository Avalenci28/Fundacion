import pool from '../config/database.js';
import { getPool } from '../config/database.js';

// Generic helpers
export const countByFilters = async (table, filters = {}) => {
  const poolInstance = getPool();
  let query = `SELECT COUNT(*) FROM ${table}`;
  const params = [];
  let paramCount = 1;
  
  for (const [key, value] of Object.entries(filters)) {
    query += ` AND ${key} = $${paramCount++}`;
    params.push(value);
  }
  
  const result = await poolInstance.query(query, params);
  return parseInt(result.rows[0].count);
};

export const paginate = async (table, filters = {}, page = 1, limit = 20, sort = 'created_at DESC') => {
  const poolInstance = getPool();
  const offset = (page - 1) * limit;
  
  let whereClause = 'WHERE 1=1';
  const params = [];
  let paramCount = 1;
  
  for (const [key, value] of Object.entries(filters)) {
    whereClause += ` AND ${key} = $${paramCount++}`;
    params.push(value);
  }
  
  const countQuery = `SELECT COUNT(*) FROM ${table} ${whereClause}`;
  const dataQuery = `SELECT * FROM ${table} ${whereClause} ORDER BY ${sort} LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);
  
  const [countResult, dataResult] = await Promise.all([
    poolInstance.query(countQuery, params.slice(0, -2)),
    poolInstance.query(dataQuery, params)
  ]);
  
  return {
    data: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
  };
};

export const withTransaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};


// Users queries
export const users = {
  create: (data) => pool.query(
    `INSERT INTO users (name, email, password, role, avatar, phone, bio, volunteer_info) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [data.name, data.email, data.password, data.role || 'user', data.avatar || '', data.phone || '', data.bio || '{}']
  ),
  
  findByEmail: (email) => pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  ),
  
  findById: (id) => pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  ),
  
  findAll: () => pool.query(
    `SELECT * FROM users ORDER BY created_at DESC`
  ),
  
  update: (id, data) => pool.query(
    `UPDATE users SET name = $1, phone = $2, bio = $3, avatar = $4, updated_at = NOW() 
     WHERE id = $5 RETURNING *`,
    [data.name, data.phone, data.bio, data.avatar, id]
  ),
  
  delete: (id) => pool.query(
    `DELETE FROM users WHERE id = $1`,
    [id]
  )
};

// Projects queries
export const projects = {
  create: (data) => pool.query(
    `INSERT INTO projects (title, description, short_description, image, gallery, status, category, start_date, end_date, location, beneficiaries, volunteers, is_featured, is_active) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
    [data.title, data.description, data.short_description || '', data.image || '[]', data.status || 'Próximamente', 
     data.category || 'social', data.start_date, data.end_date, data.location || '', data.beneficiaries || 0, '[]', 
     data.is_featured || false, data.is_active !== false]
  ),
  
  findAll: (filters = {}) => {
    let query = `SELECT * FROM projects WHERE 1=1`;
    const params = [];
    let paramCount = 1;
    
    if (filters.is_active !== false) {
      query += ` AND is_active = $${paramCount++}`;
      params.push(true);
    }
    if (filters.status) {
      query += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }
    if (filters.category) {
      query += ` AND category = $${paramCount++}`;
      params.push(filters.category);
    }
    if (filters.is_featured) {
      query += ` AND is_featured = $${paramCount++}`;
      params.push(true);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }
    
    return pool.query(query, params);
  },
  
  findById: (id) => pool.query(
    `SELECT * FROM projects WHERE id = $1`,
    [id]
  ),
  
  update: (id, data) => pool.query(
    `UPDATE projects SET title = $1, description = $2, short_description = $3, image = $4, status = $5, category = $6, 
     start_date = $7, end_date = $8, location = $9, beneficiaries = $10, is_featured = $11, is_active = $12, updated_at = NOW() 
     WHERE id = $13 RETURNING *`,
    [data.title, data.description, data.short_description, data.image, data.status, data.category, data.start_date, 
     data.end_date, data.location, data.beneficiaries, data.is_featured, data.is_active, id]
  ),
  
  delete: (id) => pool.query(
    `UPDATE projects SET is_active = false, updated_at = NOW() WHERE id = $1`,
    [id]
  )
};

// Events queries
export const events = {
  create: (data) => pool.query(
    `INSERT INTO events (title, description, image, type, date, end_date, location, capacity, attendees, is_featured, is_active, requires_registration) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [data.title, data.description, data.image || '', data.type || 'social', data.date, data.end_date, data.location, data.capacity || 100, 
     '[]', data.is_featured || false, data.is_active !== false, data.requires_registration !== false]
  ),
  
  findAll: (filters = {}) => {
    let query = `SELECT * FROM events WHERE 1=1`;
    const params = [];
    let paramCount = 1;
    
    if (filters.is_active !== false) {
      query += ` AND is_active = $${paramCount++}`;
      params.push(true);
    }
    if (filters.type) {
      query += ` AND type = $${paramCount++}`;
      params.push(filters.type);
    }
    
    query += ` ORDER BY date DESC`;
    
    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }
    
    return pool.query(query, params);
  },
  
  findById: (id) => pool.query(
    `SELECT * FROM events WHERE id = $1`,
    [id]
  ),
  
  update: (id, data) => pool.query(
    `UPDATE events SET title = $1, description = $2, image = $3, type = $4, date = $5, end_date = $6, 
     location = $7, capacity = $8, is_featured = $9, is_active = $10, requires_registration = $11, updated_at = NOW() 
     WHERE id = $12 RETURNING *`,
    [data.title, data.description, data.image, data.type, data.date, data.end_date, data.location, data.capacity, 
     data.is_featured, data.is_active, data.requires_registration, id]
  ),
  
  delete: (id) => pool.query(
    `UPDATE events SET is_active = false, updated_at = NOW() WHERE id = $1`,
    [id]
  )
};

// Posts queries
export const posts = {
  create: (data) => pool.query(
    `INSERT INTO posts (title, slug, excerpt, content, image, author_id, category, tags, comments, likes, views, is_published, is_featured) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
    [data.title, data.slug, data.excerpt || '', data.content, data.image || '', data.author_id, data.category || 'blog', 
     '[]', '[]', 0, data.is_published !== false, data.is_featured || false]
  ),
  
  findAll: (filters = {}) => {
    let query = `SELECT p.*, u.name as author_name, u.avatar as author_avatar 
               FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE 1=1`;
    const params = [];
    let paramCount = 1;
    
    if (filters.is_published !== false) {
      query += ` AND is_published = $${paramCount++}`;
      params.push(true);
    }
    if (filters.category) {
      query += ` AND category = $${paramCount++}`;
      params.push(filters.category);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }
    
    return pool.query(query, params);
  },
  
  findById: (id) => pool.query(
    `SELECT p.*, u.name as author_name, u.avatar as author_avatar 
     FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = $1`,
    [id]
  ),
  
  update: (id, data) => pool.query(
    `UPDATE posts SET title = $1, slug = $2, excerpt = $3, content = $4, image = $5, category = $6, 
     is_published = $7, is_featured = $8, updated_at = NOW() 
     WHERE id = $9 RETURNING *`,
    [data.title, data.slug, data.excerpt, data.content, data.image, data.category, data.is_published, data.is_featured, id]
  ),
  
  delete: (id) => pool.query(
    `DELETE FROM posts WHERE id = $1`,
    [id]
  )
};

// Gallery queries
export const gallery = {
  create: (data) => pool.query(
    `INSERT INTO gallery (title, description, url, thumbnail, type, category, project_id, event_id, is_featured, is_active) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [data.title, data.description || '', data.url, data.thumbnail || '', data.type || 'image', data.category || 'otro', 
     data.project_id, data.event_id, data.is_featured || false, data.is_active !== false]
  ),
  
  findAll: (filters = {}) => {
    let query = `SELECT * FROM gallery WHERE 1=1`;
    const params = [];
    let paramCount = 1;
    
    if (filters.is_active !== false) {
      query += ` AND is_active = $${paramCount++}`;
      params.push(true);
    }
    if (filters.category) {
      query += ` AND category = $${paramCount++}`;
      params.push(filters.category);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }
    
    return pool.query(query, params);
  },
  
  findById: (id) => pool.query(
    `SELECT * FROM gallery WHERE id = $1`,
    [id]
  ),
  
  update: (id, data) => pool.query(
    `UPDATE gallery SET title = $1, description = $2, url = $3, thumbnail = $4, type = $5, category = $6, 
     is_featured = $7, is_active = $8, updated_at = NOW() 
     WHERE id = $9 RETURNING *`,
    [data.title, data.description, data.url, data.thumbnail, data.type, data.category, data.is_featured, data.is_active, id]
  ),
  
  delete: (id) => pool.query(
    `UPDATE gallery SET is_active = false, updated_at = NOW() WHERE id = $1`,
    [id]
  )
};

// Contacts queries
export const contacts = {
  create: (data) => pool.query(
    `INSERT INTO contacts (name, email, phone, subject, message, is_read, is_replied) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [data.name, data.email, data.phone || '', data.subject, data.message, false, false]
  ),
  
  findAll: (filters = {}) => {
    let query = `SELECT * FROM contacts WHERE 1=1`;
    const params = [];
    let paramCount = 1;
    
    if (filters.is_read !== undefined) {
      query += ` AND is_read = $${paramCount++}`;
      params.push(filters.is_read);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }
    
    return pool.query(query, params);
  },
  
  findById: (id) => pool.query(
    `SELECT * FROM contacts WHERE id = $1`,
    [id]
  ),
  
  markAsRead: (id) => pool.query(
    `UPDATE contacts SET is_read = true, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  ),
  
  delete: (id) => pool.query(
    `DELETE FROM contacts WHERE id = $1`,
    [id]
  )
};

// Stats queries
export const stats = {
  get: async () => {
    const usersCount = await pool.query(`SELECT COUNT(*) FROM users`);
    const projectsCount = await pool.query(`SELECT COUNT(*) FROM projects WHERE is_active = true`);
    const eventsCount = await pool.query(`SELECT COUNT(*) FROM events WHERE is_active = true AND date >= NOW()`);
    const postsCount = await pool.query(`SELECT COUNT(*) FROM posts WHERE is_published = true`);
    const galleryCount = await pool.query(`SELECT COUNT(*) FROM gallery WHERE is_active = true`);
    const contactsCount = await pool.query(`SELECT COUNT(*) FROM contacts WHERE is_read = false`);
    
    return {
      users: parseInt(usersCount.rows[0].count),
      projects: parseInt(projectsCount.rows[0].count),
      events: parseInt(eventsCount.rows[0].count),
      posts: parseInt(postsCount.rows[0].count),
      gallery: parseInt(galleryCount.rows[0].count),
      unreadMessages: parseInt(contactsCount.rows[0].count)
    };
  }
};

export const participations = {
  create: (data) => pool.query(
    `INSERT INTO participations (name, email, phone, skills, availability, motivation, status) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [data.name, data.email, data.phone || '', data.skills || '', data.availability || '', data.motivation || '', 'pending']
  ),

  findAll: (filters = {}) => {
    let query = `SELECT * FROM participations WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }

    query += ` ORDER BY created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    }

    return pool.query(query, params);
  },

  findById: (id) => pool.query(
    `SELECT * FROM participations WHERE id = $1`,
    [id]
  ),

  updateStatus: (id, status) => pool.query(
    `UPDATE participations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  ),

  delete: (id) => pool.query(
    `DELETE FROM participations WHERE id = $1`,
    [id]
  )
};

export default {
  users,
  projects,
  events,
  posts,
  gallery,
  contacts,
  participations,
  stats
};
