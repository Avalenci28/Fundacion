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
    `INSERT INTO projects (title, description, short_description, image, status, category, start_date, end_date, beneficiaries, is_featured, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [data.title, data.description, data.short_description || '', data.image || '', data.status || 'Próximamente',
     data.category || 'social', data.start_date, data.end_date || null, data.beneficiaries || 0,
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
     start_date = $7, end_date = $8, beneficiaries = $9, is_featured = $10, is_active = $11, updated_at = NOW()
     WHERE id = $12 RETURNING *`,
    [data.title, data.description, data.short_description, data.image, data.status, data.category, data.start_date,
     data.end_date, data.beneficiaries, data.is_featured, data.is_active, id]
  ),

  delete: (id) => pool.query(
    `UPDATE projects SET is_active = false, updated_at = NOW() WHERE id = $1`,
    [id]
  )
};

// Events queries
export const events = {
  create: (data) => pool.query(
    `INSERT INTO events (title, description, date, location, image, capacity, status, is_featured, is_active, category)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [data.title, data.description, data.date, data.location || '', data.image || '', data.capacity || 100,
     data.status || 'upcoming', data.is_featured || false, data.is_active !== false, data.category || 'social']
  ),

  findAll: (filters = {}) => {
    let query = `SELECT * FROM events WHERE 1=1`;
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
    `UPDATE events SET title = $1, description = $2, date = $3, location = $4, image = $5, capacity = $6,
     status = $7, is_featured = $8, is_active = $9, category = $10, updated_at = NOW()
     WHERE id = $11 RETURNING *`,
    [data.title, data.description, data.date, data.location, data.image, data.capacity,
     data.status, data.is_featured, data.is_active, data.category, id]
  ),

  delete: (id) => pool.query(
    `UPDATE events SET is_active = false, updated_at = NOW() WHERE id = $1`,
    [id]
  )
};

// Posts queries
export const posts = {
  create: (data) => pool.query(
    `INSERT INTO posts (title, content, image, author, slug, category, is_active, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [data.title, data.content, data.image || '', data.author || '', data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
     data.category || 'blog', data.is_active !== false, data.is_featured || false]
  ),

  findAll: (filters = {}) => {
    let query = `SELECT * FROM posts WHERE 1=1`;
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
    `SELECT * FROM posts WHERE id = $1`,
    [id]
  ),

  update: (id, data) => pool.query(
    `UPDATE posts SET title = $1, content = $2, image = $3, author = $4, slug = $5,
     category = $6, is_active = $7, is_featured = $8, updated_at = NOW()
     WHERE id = $9 RETURNING *`,
    [data.title, data.content, data.image, data.author, data.slug, data.category, data.is_active, data.is_featured, id]
  ),

  delete: (id) => pool.query(
    `DELETE FROM posts WHERE id = $1`,
    [id]
  )
};

// Gallery queries
export const gallery = {
  create: (data) => pool.query(
    `INSERT INTO gallery (title, image, category, is_active, is_featured)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.title, data.url || data.image, data.category || 'otro', data.is_active !== false, data.is_featured || false]
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
    `UPDATE gallery SET title = $1, image = $2, category = $3, is_active = $4, is_featured = $5, updated_at = NOW()
     WHERE id = $6 RETURNING *`,
    [data.title, data.url || data.image, data.category, data.is_active, data.is_featured, id]
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

  update: (id, data) => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }
    if (data.subject !== undefined) {
      fields.push(`subject = $${paramCount++}`);
      values.push(data.subject);
    }
    if (data.message !== undefined) {
      fields.push(`message = $${paramCount++}`);
      values.push(data.message);
    }
    if (data.is_read !== undefined) {
      fields.push(`is_read = $${paramCount++}`);
      values.push(data.is_read);
    }
    if (data.is_replied !== undefined) {
      fields.push(`is_replied = $${paramCount++}`);
      values.push(data.is_replied);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    return pool.query(
      `UPDATE contacts SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
  },

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
