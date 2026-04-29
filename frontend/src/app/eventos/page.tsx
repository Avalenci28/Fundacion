'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useQuery } from 'react-query'
import { Calendar, MapPin, Users, Filter, Music, Dumbbell, GraduationCap, TreePine, Heart } from 'lucide-react'
import { publicApi } from '@/lib/api'

const typeFilters = [
  { value: '', label: 'Todos', icon: Filter },
  { value: 'cultural', label: 'Cultural', icon: Music },
  { value: 'deportivo', label: 'Deportivo', icon: Dumbbell },
  { value: 'educativo', label: 'Educativo', icon: GraduationCap },
  { value: 'ambiental', label: 'Ambiental', icon: TreePine },
  { value: 'social', label: 'Social', icon: Heart },
]

export default function EventsPage() {
  const [typeFilter, setTypeFilter] = useState('')
  const { data, isLoading } = useQuery(
    ['events', typeFilter],
    () => publicApi.getEvents({ type: typeFilter }).then(res => res.data),
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
            Eventos y Actividades
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Participa en nuestras actividades y sé parte del cambio
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                typeFilter === filter.value
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-96" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.events?.map((event: any, index: number) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className="relative h-48">
                    <Image
                      src={event.image || '/placeholder.jpg'}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-center shadow-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        {new Date(event.date).toLocaleString('es', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
                      {event.type}
                    </span>
                    <h3 className="font-display text-xl font-bold mt-2 mb-3 text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('es', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{event.capacity} cupos</span>
                      </div>
                      <button className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 transition-colors">
                        Inscribirse
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

