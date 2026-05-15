'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'

import { CalendarDays, Check, Edit2, FolderOpen, ImageIcon, LayoutDashboard, MessageSquare, Users, Plus, Trash2 } from 'lucide-react'

import toast from 'react-hot-toast'

import AdminProjectsCRUD from '@/components/admin/AdminProjectsCRUD'
import AdminEventsCRUD from '@/components/admin/AdminEventsCRUD'
import AdminGalleryCRUD from '@/components/admin/AdminGalleryCRUD'
import AdminContactsCRUD from '@/components/admin/AdminContactsCRUD'
import AdminParticipationsCRUD from '@/components/admin/AdminParticipationsCRUD'
import { useAuthStore } from '@/store/authStore'
import { adminApi } from '@/lib/api'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Proyectos', icon: FolderOpen },
  { id: 'events', label: 'Eventos', icon: CalendarDays },
  { id: 'participations', label: 'Participaciones', icon: Users },
  { id: 'gallery', label: 'Galería', icon: ImageIcon },
  { id: 'contacts', label: 'Mensajes', icon: MessageSquare }
] as const

type TabId = (typeof tabs)[number]['id']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  // Queries for counting items - always enabled to show correct count
  const { data: projectsData, refetch: refetchProjects } = useQuery(['adminProjects'], () => adminApi.getAllProjects().then(res => res.data))
  const { data: eventsData, refetch: refetchEvents } = useQuery(['adminEvents'], () => adminApi.getAllEvents().then(res => res.data))
  
  const { data: galleryData, refetch: refetchGallery } = useQuery(['adminGallery'], () => adminApi.getAllGallery().then(res => res.data))
  const { data: contactsData, refetch: refetchContacts } = useQuery(['adminContacts'], () => adminApi.getAllContacts().then(res => res.data))
  const { data: participationsData, refetch: refetchParticipations } = useQuery(['adminParticipations'], () => adminApi.getAllParticipations().then(res => res.data))

  const getCount = (tab?: string) => {
    const t = tab || activeTab
    switch (t) {
      case 'projects': return projectsData?.projects?.length ?? 0
      case 'events': return eventsData?.events?.length ?? 0
      case 'participations': return participationsData?.participations?.filter((p: any) => p.status === 'pending').length ?? 0
      case 'gallery': return galleryData?.gallery?.length ?? 0
      case 'contacts': return contactsData?.contacts?.filter((c: any) => !c.is_read).length ?? 0
      default: return 0
    }
  }

  // Refetch when tab changes to ensure fresh count
  useEffect(() => {
    if (activeTab === 'projects') refetchProjects()
    else if (activeTab === 'events') refetchEvents()
    
    else if (activeTab === 'gallery') refetchGallery()
    else if (activeTab === 'contacts') refetchContacts()
  }, [activeTab])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'admin')) {
      router.replace('/login')
    }
  }, [mounted, isAuthenticated, user, router])

  if (!mounted || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    )
  }

  const renderContent = () => {
    // Dashboard stats
    if (activeTab === 'dashboard') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FolderOpen className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Proyectos</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{getCount('projects')}</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <CalendarDays className="w-8 h-8 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Eventos</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{getCount('events')}</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-100 rounded-xl">
                  <Users className="w-8 h-8 text-pink-600" />
                </div>
                <span className="text-sm text-gray-500">Participaciones</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{getCount('participations')}</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <ImageIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-500">Galería</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{getCount('gallery')}</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <MessageSquare className="w-8 h-8 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">Mensajes</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{getCount('contacts')}</div>
              <div className="text-sm text-gray-500 mt-1">sin leer</div>
            </motion.div>
          </div>

          {/* Recent Projects Preview */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Proyectos Recientes</h3>
            {projectsData?.projects?.length > 0 ? (
              <div className="space-y-3">
                {projectsData.projects.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{p.title}</div>
                      <div className="text-sm text-gray-500">{p.status} • {p.category}</div>
                    </div>
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{p.beneficiaries} beneficiarios</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay proyectos todavía</p>
            )}
          </motion.div>
        </motion.div>
      )
    }

    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>

          {activeTab !== 'contacts' && activeTab !== 'dashboard' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-3xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
              onClick={() => toast.success(`${activeTab} creado!`)}
            >
              <Plus className="w-5 h-5" />
              Nuevo {activeTab}
            </motion.button>
          )}
        </div>

        {activeTab === 'projects' ? (
          <AdminProjectsCRUD />
        ) : activeTab === 'events' ? (
          <AdminEventsCRUD />
        ) : activeTab === 'gallery' ? (
          <AdminGalleryCRUD />
        ) : activeTab === 'participations' ? (
          <AdminParticipationsCRUD />
        ) : activeTab === 'contacts' ? (
          <AdminContactsCRUD />
        ) : (
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                  <tr>
                    <th className="px-8 py-6 text-left font-bold text-xl text-gray-900 dark:text-white">
                      Título/Nombre
                    </th>
                    <th className="px-8 py-6 text-left font-bold text-xl text-gray-900 dark:text-white">
                      Estado/Fecha
                    </th>
                    <th className="px-8 py-6 text-left font-bold text-xl text-gray-900 dark:text-white">
                      Detalles
                    </th>
                    <th className="px-8 py-6 text-right font-bold text-xl text-gray-900 dark:text-white">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {Array.from({ length: 8 }, (_, i) => (
                    <motion.tr
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all cursor-pointer border-b border-gray-100 dark:border-gray-700"
                    >
                      <td className="px-8 py-8">
                        <div className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                          {activeTab} Ejemplo {i + 1}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Descripción completa con todos los campos de validación
                          Joi/Zod aplicados ✅
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-100 text-emerald-800 font-semibold shadow-md">
                          <Check className="w-4 h-4" />
                          {activeTab === 'contacts' ? 'Leído' : 'Activo'}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-lg font-medium text-gray-900 dark:text-white">
                        {activeTab === 'events' ? '15/05/2024 • 150 cupo' : 'Categoría Social'}
                      </td>
                      <td className="px-8 py-8 text-right space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="inline-flex items-center gap-2 p-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-2xl font-bold shadow-md transition-all"
                          onClick={() => toast('Editando...')}
                        >
                          <Edit2 className="w-5 h-5" />
                          Editar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="inline-flex items-center gap-2 p-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-2xl font-bold shadow-md transition-all"
                          onClick={() => toast('Eliminado!')}
                        >
                          <Trash2 className="w-5 h-5" />
                          Eliminar
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab !== 'contacts' && activeTab !== 'dashboard' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all"
            >
              Ver Todos ({getCount()})
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-10">
          <motion.nav
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                Admin Panel
              </h1>

              <div className="space-y-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <motion.button
                      key={tab.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-4 p-6 rounded-2xl text-left font-semibold transition-all group hover:shadow-xl ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/30 scale-[1.02]'
                          : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 text-gray-700 dark:text-gray-300 hover:scale-[1.02]'
                      }`}
                    >
                      <Icon className="w-7 h-7 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <span>{tab.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.nav>

          <motion.main initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            {renderContent()}
          </motion.main>
        </div>
      </div>
    </div>
  )
}

