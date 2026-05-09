import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  register,
  login,
  adminLogin,
  getMe,
  updateProfile,
  logout
} from '../controllers/authController.js';

const router = express.Router();

// NOTE: Public registration DISABLED (admin-only via seed).
// router.post('/register', [ ... ], register);

// Unified login - works for both regular users and admin
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Legacy admin login endpoint (redirects to unified login)
router.post('/admin/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], adminLogin);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', logout);

export default router;

