import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getEvents,
  getEvent,
  registerForEvent,
  getFeaturedEvents
} from '../controllers/eventController.js';

const router = express.Router();

// Public routes - READ ONLY
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/:id', getEvent);

// Protected user route (non-admin can register for event)
router.post('/:id/register', protect, registerForEvent);

export default router;
