'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useQuery } from 'react-query'
import { X, Filter, ImageIcon, Video } from 'lucide-react'
import api from '@/lib/api'

const categoryFilters = [
  { value: '', label: 'Todas', icon: Filter },
  { value: 'evento', label: 'Eventos', icon: ImageIcon },
  { value: 'proyecto', label: 'Proyectos', icon: ImageIcon },
  { value: 'comunidad', label: 'Comunidad', icon: ImageIcon },
]

export default function GalleryPage() {
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedImage, setSelectedImage] = useState<any>(null)

  const { data, isLoading } = useQuery(
    ['gallery', categoryFilter],
    () => api.get(`/gallery?category=${categoryFilter}`).then(res => res.data),
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
            Galería
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Momentos especiales de nuestra comunidad
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categoryFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setCategoryFilter(filter.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                categoryFilter === filter.value
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-2xl aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.items?.map((item: any, index: number) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white font-medium text-sm">{item.title}</p>
                </div>
                {item.type === 'video' && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                width={1200}
                height={800}
                className="w-full h-full object-contain rounded-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                <h3 className="text-white font-display text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-white/70 text-sm mt-1">{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

