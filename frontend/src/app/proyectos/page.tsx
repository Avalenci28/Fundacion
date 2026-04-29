'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { ArrowRight, Filter, CheckCircle2, Clock, Rocket } from 'lucide-react'
import { publicApi } from '@/lib/api'

const statusFilters = [
  { value: '', label: 'Todos', icon: Filter },
  { value: 'Completado', label: 'Completados', icon: CheckCircle2 },
  { value: 'En proceso', label: 'En Proceso', icon: Clock },
  { value: 'Próximamente', label: 'Próximos', icon: Rocket },
]

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const { data, isLoading } = useQuery(
    ['projects', statusFilter],
    () => publicApi.getProjects({ status: statusFilter }).then(res => res.data),
    { keepPreviousData: true }
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Nuestros Proyectos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Conoce las iniciativas que están transformando nuestra comunidad
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                statusFilter === filter.value
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-96" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.projects?.map((project: any, index: number) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={project.image || '/placeholder.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'Completado' ? 'bg-green-500 text-white' :
                        project.status === 'En proceso' ? 'bg-blue-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold text-primary-500">{project.beneficiaries}</span> beneficiarios
                      </div>
                      <button className="flex items-center gap-1 text-primary-500 font-semibold text-sm hover:underline">
                        Ver más <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

