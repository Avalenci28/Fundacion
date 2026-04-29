import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getProjects,
  getProject,
  joinProject,
  getFeaturedProjects
} from '../controllers/projectController.js';

const router = express.Router();

// Public routes - READ ONLY
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProject);

// Protected user route (non-admin can join project)
router.post('/:id/join', protect, joinProject);

export default router;
