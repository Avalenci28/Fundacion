import express from 'express';
import { body } from 'express-validator';
import {
  submitParticipation,
  getAllParticipations,
  updateParticipationStatus,
  deleteParticipation
} from '../controllers/participationController.js';

const router = express.Router();

// Public route - submit participation request
router.post('/submit', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('motivation').trim().notEmpty().withMessage('Please tell us why you want to participate')
], submitParticipation);

// These routes are protected - handled by admin routes file
// router.get('/', protect, getAllParticipations);
// router.put('/:id/status', protect, authorize('admin'), updateParticipationStatus);
// router.delete('/:id', protect, authorize('admin'), deleteParticipation);

export default router;
