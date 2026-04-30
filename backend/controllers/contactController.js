import { contacts } from '../db/query.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const result = await contacts.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });
    
    const contact = result.rows[0];
    res.status(201).json({ success: true, message: 'Message sent successfully', contact });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const { is_read, page = 1, limit = 20 } = req.query;
    
    const filters = {};
    if (is_read !== undefined) filters.is_read = is_read === 'true';
    if (limit) filters.limit = parseInt(limit);
    
    const result = await contacts.findAll(filters);
    const count = result.rows.length;
    
    res.json({
      success: true,
      contacts: result.rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const result = await contacts.findById(req.params.id);
    const contact = result.rows[0];
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const result = await contacts.markAsRead(req.params.id);
    const contact = result.rows[0];
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const result = await contacts.delete(req.params.id);
    const contact = result.rows[0];
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
