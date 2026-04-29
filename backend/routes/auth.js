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

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.post('/admin/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], adminLogin);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', logout);

export default router;

