import express from 'express';
import {
  getGallery,
  getGalleryItem,
  getFeaturedGallery
} from '../controllers/galleryController.js';

const router = express.Router();

// Public routes - READ ONLY
router.get('/', getGallery);
router.get('/featured', getFeaturedGallery);
router.get('/:id', getGalleryItem);

export default router;
