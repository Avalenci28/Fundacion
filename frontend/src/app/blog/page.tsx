'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { Calendar, User, ArrowRight } from 'lucide-react'
import api from '@/lib/api'

export default function BlogPage() {
  const { data, isLoading } = useQuery('posts', () =>
    api.get('/posts').then(res => res.data)
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Blog y Noticias
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Mantente informado sobre nuestras actividades y logros
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-3xl h-96" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.posts?.map((post: any, index: number) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image || '/placeholder.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleDateString('es')}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author?.name || 'Admin'}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {post.excerpt || post.content}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm hover:underline"
                  >
                    Leer más <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

