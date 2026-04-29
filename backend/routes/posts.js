import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getPosts,
  getPost,
  addComment,
  likePost,
  getFeaturedPosts
} from '../controllers/postController.js';

const router = express.Router();

// Public routes - READ ONLY
router.get('/', getPosts);
router.get('/featured', getFeaturedPosts);
router.get('/:slug', getPost);

// Protected user routes (non-admin can comment and like)
router.post('/:id/comments', protect, addComment);
router.post('/:id/like', protect, likePost);

export default router;
