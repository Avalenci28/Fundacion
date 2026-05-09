'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { publicApi } from '@/lib/api';

interface Project {
  _id: string;
  id: number;
  title: string;
  description: string;
  image: string;
  status: string;
  category: string;
  beneficiaries: number;
  is_featured: boolean;
  goal_amount: string;
  raised_amount: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'all'>('featured');

  useEffect(() => {
    // Fetch from PostgreSQL backend using publicApi
    const fetchProjects = async () => {
      try {
        const response = await publicApi.getProjects();
        const data = response.data;
        if (data.success && data.projects) {
          if (activeTab === 'featured') {
            // Filter featured projects
            const featured = data.projects.filter((p: Project) => p.is_featured);
            setProjects(featured.slice(0, 3));
          } else {
            setProjects(data.projects.slice(0, 6));
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback demo projects
        setProjects([
          {
            _id: '1',
            id: 1,
            title: 'Parque de la Esperanza',
            description: 'Transformación completa del parque central con áreas infantiles y espacios para adultos mayores.',
            image: 'https://images.unsplash.com/photo-1598119517754-2f151271c9d9?w=800&fit=crop',
            status: 'En proceso',
            category: 'ambiental',
            beneficiaries: 1200,
            is_featured: true,
            goal_amount: '50000',
            raised_amount: '25000'
          },
          {
            _id: '2',
            id: 2,
            title: 'Taller de Arte para Niños',
            description: 'Programa educativo artístico que beneficia a 150 niños de primaria con materiales donados.',
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&fit=crop',
            status: 'En proceso',
            category: 'educativo',
            beneficiaries: 150,
            is_featured: false,
            goal_amount: '15000',
            raised_amount: '7500'
          },
          {
            _id: '3',
            id: 3,
            title: 'Limpieza del Río Malambo',
            description: 'Campaña masiva de limpieza con participación de toda la comunidad.',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&fit=crop',
            status: 'Próximamente',
            category: 'ambiental',
            beneficiaries: 800,
            is_featured: false,
            goal_amount: '8000',
            raised_amount: '0'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [activeTab]);

  const statusColors: Record<string, string> = {
    'Completado': 'from-emerald-500 to-emerald-600',
    'En proceso': 'from-yellow-500 to-yellow-600',
    'Próximamente': 'from-blue-500 to-blue-600'
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
            Nuestros Proyectos
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transformamos Malambo con proyectos que unen a la comunidad y generan impacto real
          </p>
        </motion.div>

{/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {(['featured', 'all'] as const).map(tab => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                  : 'bg-white/50 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200 hover:scale-105'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === 'featured' ? '⭐ Destacados' : '📋 Todos'}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-300 rounded-2xl mb-6"></div>
                <div className="h-6 bg-gray-300 rounded-full mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </motion.div>
            ))
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-pink-200/50"
              >
                {/* Project Image */}
                <div className="h-64 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 transition-transform duration-700">
                  <img 
                    src={project.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-700"
                  />
                  <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg ${
                    `bg-gradient-to-r ${statusColors[project.status] || 'bg-gray-500'}`
                  }`}>
                    {project.status}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-8">
                  <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 mb-4">
                    {project.category}
                  </span>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-pink-600 transition-colors duration-300 leading-tight">
                    {project.title}
                  </h3>
                  
<p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>👥</span>
                        <span>{(project.beneficiaries || 100).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Ver Proyecto
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-5 px-12 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            Ver Todos los Proyectos → 
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
