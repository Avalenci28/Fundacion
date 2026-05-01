import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDashboard,
  getUsers,
  updateUser,
  deleteUser,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getAllContacts,
  markContactAsRead,
  deleteContact
} from '../controllers/adminController.js';

import {
  getAllParticipations,
  updateParticipationStatus,
  deleteParticipation
} from '../controllers/participationController.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Users
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Projects
router.get('/projects', getAllProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Events
router.get('/events', getAllEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Posts
router.get('/posts', getAllPosts);
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

// Gallery
router.get('/gallery', getAllGallery);
router.post('/gallery', createGalleryItem);
router.put('/gallery/:id', updateGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

// Contacts
router.get('/contacts', getAllContacts);
router.put('/contacts/:id/read', markContactAsRead);
router.delete('/contacts/:id', deleteContact);

// Participations
router.get('/participations', getAllParticipations);
router.put('/participations/:id/status', updateParticipationStatus);
router.delete('/participations/:id', deleteParticipation);

export default router;
