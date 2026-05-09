import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllProjects, adminCreateProject, adminUpdateProject, adminDeleteProject
} from '../controllers/adminProjectController.js';
import {
  getAllEvents, adminCreateEvent, adminUpdateEvent, adminDeleteEvent
} from '../controllers/adminEventController.js';
import {
  getAllPosts, adminCreatePost, adminUpdatePost, adminDeletePost
} from '../controllers/adminPostController.js';
import {
  getAllGallery, adminCreateGalleryItem, adminUpdateGalleryItem, adminDeleteGalleryItem
} from '../controllers/adminGalleryController.js';
import { getDashboard, getUsers, updateUser, deleteUser, getAllContacts, markContactAsRead, deleteContact } from '../controllers/adminController.js';


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
router.post('/projects', adminCreateProject);
router.put('/projects/:id', adminUpdateProject);
router.delete('/projects/:id', adminDeleteProject);

// Events
router.get('/events', getAllEvents);
router.post('/events', adminCreateEvent);
router.put('/events/:id', adminUpdateEvent);
router.delete('/events/:id', adminDeleteEvent);

// Posts
router.get('/posts', getAllPosts);
router.post('/posts', adminCreatePost);
router.put('/posts/:id', adminUpdatePost);
router.delete('/posts/:id', adminDeletePost);

// Gallery
router.get('/gallery', getAllGallery);
router.post('/gallery', adminCreateGalleryItem);
router.put('/gallery/:id', adminUpdateGalleryItem);
router.delete('/gallery/:id', adminDeleteGalleryItem);

// Contacts
router.get('/contacts', getAllContacts);
router.put('/contacts/:id/read', markContactAsRead);
router.delete('/contacts/:id', deleteContact);

// Participations
router.get('/participations', getAllParticipations);
router.put('/participations/:id/status', updateParticipationStatus);
router.delete('/participations/:id', deleteParticipation);

export default router;
