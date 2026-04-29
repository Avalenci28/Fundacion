import Event from '../models/Event.js';

export const getEvents = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 10, upcoming, search } = req.query;
    const query = { isActive: true };
    
    if (type) query.type = type;
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const events = await Event.find(query)
      .populate('attendees.user', 'name avatar')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Event.countDocuments(query);
    
    res.json({
      success: true,
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendees.user', 'name avatar');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    const alreadyRegistered = event.attendees.find(a => a.user.toString() === req.user.id);
    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }
    
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }
    
    event.attendees.push({ user: req.user.id });
    await event.save();
    
    res.json({ success: true, message: 'Registered for event successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ isActive: true, isFeatured: true, date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(6);
    res.json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

