import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ===== PUBLIC API =====

export const publicApi = {
  // Projects
  getProjects: (params?: any) => api.get('/projects', { params }),
  getProject: (id: string) => api.get(`/projects/${id}`),
  getFeaturedProjects: () => api.get('/projects/featured'),

  // Events
  getEvents: (params?: any) => api.get('/events', { params }),
  getEvent: (id: string) => api.get(`/events/${id}`),
  getFeaturedEvents: () => api.get('/events/featured'),

  // Posts
  getPosts: (params?: any) => api.get('/posts', { params }),
  getPost: (slug: string) => api.get(`/posts/${slug}`),
  getFeaturedPosts: () => api.get('/posts/featured'),

  // Gallery
  getGallery: (params?: any) => api.get('/gallery', { params }),
  getGalleryItem: (id: string) => api.get(`/gallery/${id}`),
  getFeaturedGallery: () => api.get('/gallery/featured'),

  // Stats
  getPublicStats: () => api.get('/stats/public'),

  // Contact
  submitContact: (data: any) => api.post('/contact', data),

  // Volunteers
  getVolunteers: (params?: any) => api.get('/volunteers', { params }),
}

// ===== AUTH API =====

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  adminLogin: (data: any) => api.post('/auth/admin/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  logout: () => api.get('/auth/logout'),
}

// ===== USER ACTIONS (Requires Auth) =====

export const userApi = {
  // Projects
  joinProject: (id: string) => api.post(`/projects/${id}/join`),

  // Events
  registerForEvent: (id: string) => api.post(`/events/${id}/register`),

  // Posts
  addComment: (id: string, text: string) => api.post(`/posts/${id}/comments`, { text }),
  likePost: (id: string) => api.post(`/posts/${id}/like`),

  // Volunteers
  getProfile: () => api.get('/volunteers/profile'),
  updateProfile: (data: any) => api.put('/volunteers/profile', data),
}

// ===== ADMIN API (Requires Admin Role) =====

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),

  // Users
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Projects
  getAllProjects: (params?: any) => api.get('/admin/projects', { params }),
  createProject: (data: any) => api.post('/admin/projects', data),
  updateProject: (id: string, data: any) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/admin/projects/${id}`),

  // Events
  getAllEvents: (params?: any) => api.get('/admin/events', { params }),
  createEvent: (data: any) => api.post('/admin/events', data),
  updateEvent: (id: string, data: any) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/admin/events/${id}`),

  // Posts
  getAllPosts: (params?: any) => api.get('/admin/posts', { params }),
  createPost: (data: any) => api.post('/admin/posts', data),
  updatePost: (id: string, data: any) => api.put(`/admin/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/admin/posts/${id}`),

  // Gallery
  getAllGallery: (params?: any) => api.get('/admin/gallery', { params }),
  createGalleryItem: (data: any) => api.post('/admin/gallery', data),
  updateGalleryItem: (id: string, data: any) => api.put(`/admin/gallery/${id}`, data),
  deleteGalleryItem: (id: string) => api.delete(`/admin/gallery/${id}`),

  // Contacts
  getAllContacts: (params?: any) => api.get('/admin/contacts', { params }),
  markContactAsRead: (id: string) => api.put(`/admin/contacts/${id}/read`),
  deleteContact: (id: string) => api.delete(`/admin/contacts/${id}`),
}

export default api

