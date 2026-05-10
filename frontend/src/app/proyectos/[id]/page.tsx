'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Tag, CheckCircle2, Clock, Rocket } from 'lucide-react';
import { publicApi } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const getImageUrl = (image: string): string => {
  if (!image) return '/placeholder.jpg';
  if (image.startsWith('http')) return image;
  return `${API_URL}${image.startsWith('/') ? image : `/${image}`}`;
};

const getImageUrlForImg = (image: string): string => {
  if (!image) return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&fit=crop';
  if (image.startsWith('http')) return image;
  return `${API_URL}${image.startsWith('/') ? image : `/${image}`}`;
};

interface Project {
  id: number;
  title: string;
  description: string;
  short_description: string;
  image: string;
  status: string;
  category: string;
  beneficiaries: number;
  is_featured: boolean;
  start_date: string;
  end_date: string | null;
  goal_amount: string;
  raised_amount: string;
  created_at: string;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  'Completado': { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100 text-emerald-700' },
  'En proceso': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 text-yellow-700' },
  'Próximamente': { icon: Rocket, color: 'text-blue-600', bg: 'bg-blue-100 text-blue-700' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await publicApi.getProject(params.id as string);
        if (response.data.success) {
          setProject(response.data.project);
        } else {
          setError('Proyecto no encontrado');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse text-primary-500 text-xl">Cargando proyecto...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {error || 'Proyecto no encontrado'}
        </h1>
        <Link
          href="/proyectos"
          className="flex items-center gap-2 text-primary-500 hover:text-primary-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a proyectos
        </Link>
      </div>
    );
  }

  const statusInfo = statusConfig[project.status] || statusConfig['Próximamente'];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a proyectos
        </Link>
      </div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[400px] md:h-[500px] w-full overflow-hidden"
      >
        <img
          src={getImageUrlForImg(project.image)}
          alt={project.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-6 right-6">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg}`}>
            <StatusIcon className="w-4 h-4" />
            {project.status}
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {project.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 text-white/90"
            >
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                <Tag className="w-4 h-4" />
                {project.category}
              </span>
              {project.start_date && (
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(project.start_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                <Users className="w-4 h-4" />
                {project.beneficiaries?.toLocaleString() || 0} beneficiarios
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Sobre el Proyecto
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {project.short_description && project.short_description !== project.description && (
                <div className="mt-8 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
                  <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">
                    En resumen
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {project.short_description}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-6">
                Información del Proyecto
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">Estado</span>
                  <span className={`font-semibold ${statusInfo.color}`}>{project.status}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">Categoría</span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">{project.category}</span>
                </div>

                {project.start_date && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Fecha de inicio</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(project.start_date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}

                {project.end_date && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Fecha de fin</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(project.end_date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 dark:text-gray-400">Beneficiarios</span>
                  <span className="font-semibold text-primary-500">
                    {project.beneficiaries?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-6 shadow-lg"
            >
              <h3 className="font-display text-lg font-bold text-white mb-3">
                ¿Quieres participar?
              </h3>
              <p className="text-white/90 text-sm mb-6">
                Únete a este proyecto y ayuda a transformar nuestra comunidad.
              </p>
              <Link
                href="/participar"
                className="block w-full py-3 bg-white text-center text-pink-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Participar ahora
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}