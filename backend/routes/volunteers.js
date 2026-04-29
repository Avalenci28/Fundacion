import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getVolunteers,
  getVolunteerProfile,
  updateVolunteerInfo
} from '../controllers/volunteerController.js';

const router = express.Router();

router.get('/', getVolunteers);
router.get('/profile', protect, getVolunteerProfile);
router.put('/profile', protect, updateVolunteerInfo);

export default router;
