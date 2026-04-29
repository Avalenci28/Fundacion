import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getStats, getPublicStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/public', getPublicStats);
router.get('/', protect, authorize('admin'), getStats);

export default router;
