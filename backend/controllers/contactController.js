import Contact from '../models/Contact.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });
    
    res.status(201).json({ success: true, message: 'Message sent successfully', contact });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (isRead !== undefined) query.isRead = isRead === 'true';
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      contacts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
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
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
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
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
