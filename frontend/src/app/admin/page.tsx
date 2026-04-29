'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import {
  LayoutDashboard,
  FolderOpen,
  CalendarDays,
  Newspaper,
  ImageIcon,
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  AlertCircle
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Proyectos', icon: FolderOpen },
  { id: 'events', label: 'Eventos', icon: CalendarDays },
  { id: 'posts', label: 'Blog', icon: Newspaper },
  { id: 'gallery', label: 'Galería', icon: ImageIcon },
  { id: 'contacts', label: 'Mensajes', icon: MessageSquare },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  // Redirect if not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                  Panel Admin
                </h2>
                <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
              </div>
              <nav className="p-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'projects' && <ProjectsTab />}
            {activeTab === 'events' && <EventsTab />}
            {activeTab === 'posts' && <PostsTab />}
            {activeTab === 'gallery' && <GalleryTab />}
            {activeTab === 'contacts' && <ContactsTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardTab() {
  const { data: dashboardData } = useQuery('adminDashboard', () =>
    adminApi.getDashboard().then(res => res.data.dashboard)
  )

  const counts = dashboardData?.counts || {}

  const statCards = [
    { label: 'Proyectos', value: counts.totalProjects || 0, icon: FolderOpen, color: 'from-pink-500 to-rose-500' },
    { label: 'Eventos', value: counts.totalEvents || 0, icon: CalendarDays, color: 'from-purple-500 to-violet-500' },
    { label: 'Usuarios', value: counts.totalUsers || 0, icon: Users, color: 'from-blue-500 to-indigo-500' },
    { label: 'Mensajes', value: counts.totalContacts || 0, icon: MessageSquare, color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">
          Actividad Reciente
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Nuevo proyecto creado
                </p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectsTab() {
  const { data, refetch } = useQuery('adminProjects', () =>
    adminApi.getAllProjects().then(res => res.data)
  )

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return
    try {
      await adminApi.deleteProject(id)
      toast.success('Proyecto eliminado')
      refetch()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Proyectos
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Proyecto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Beneficiarios</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data?.projects?.map((project: any) => (
                <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{project.title}</div>
                    <div className="text-sm text-gray-500">{project.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Completado' ? 'bg-green-100 text-green-700' :
                      project.status === 'En proceso' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{project.beneficiaries}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(project._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function EventsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Eventos
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
          <Plus className="w-5 h-5" />
          Nuevo Evento
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Gestión de eventos en desarrollo</p>
      </div>
    </div>
  )
}

function PostsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Blog
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
          <Plus className="w-5 h-5" />
          Nueva Publicación
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Gestión de blog en desarrollo</p>
      </div>
    </div>
  )
}

function GalleryTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Galería
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
          <Plus className="w-5 h-5" />
          Subir Imagen
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Gestión de galería en desarrollo</p>
      </div>
    </div>
  )
}

function ContactsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Mensajes de Contacto
        </h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No hay mensajes nuevos</p>
      </div>
    </div>
  )
}

