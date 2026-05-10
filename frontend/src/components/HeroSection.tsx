'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { publicApi } from '@/lib/api';

interface Stats {
  projects: string;
  events: string;
  volunteers: string;
  users: string;
  totalProjects: string;
}

export default function HeroSection() {
  const queryClient = useQueryClient();

  const { data: statsData, isLoading } = useQuery('publicStats', () =>
    publicApi.getPublicStats().then(res => res.data)
  );

  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (statsData?.success && statsData?.stats) {
      setStats({
        projects: String(statsData.stats.projectsCompleted || 0),
        events: String(statsData.stats.eventsUpcoming || 0),
        volunteers: String(statsData.stats.volunteers || 0),
        users: String(statsData.stats.volunteers || 0),
        totalProjects: String(statsData.stats.peopleHelped || 0)
      });
    } else if (!isLoading) {
      setStats({
        projects: '0',
        events: '0',
        volunteers: '0',
        users: '0',
        totalProjects: '0'
      });
    }
  }, [statsData, isLoading]);

  // Refetch stats when window gains focus (to catch changes from admin)
  useEffect(() => {
    const handleFocus = () => {
      queryClient.invalidateQueries('publicStats');
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [queryClient]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-pink-400/20 rounded-full blur-xl"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-xl"
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo/Title */}
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-12"
          >
<motion.div
              className="relative w-24 h-24 mx-auto mb-6"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src="/logo.svg"
                alt="Fundación Malambo Sonríe"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="96px"
              />
            </motion.div>
            <div className="text-6xl md:text-8xl font-black bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-6">
              Malambo Sonríe
            </div>
            <div className="text-3xl md:text-4xl font-bold text-pink-200">
              Conectando corazones, construyendo comunidad
            </div>
          </motion.div>

          {/* Stats Cards */}
          {!isLoading && stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
<div className="text-3xl md:text-4xl font-black text-pink-300 mb-2">
                  {stats.projects}
                </div>
                <div className="text-white/90 text-sm font-medium">Proyectos</div>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-black text-purple-300 mb-2">
                  {stats.events}
                </div>
                <div className="text-white/90 text-sm font-medium">Eventos</div>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-black text-pink-300 mb-2">
                  {stats.volunteers}
                </div>
                <div className="text-white/90 text-sm font-medium">Voluntarios</div>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-black text-purple-300 mb-2">
                  {stats.users}
                </div>
                <div className="text-white/90 text-sm font-medium">Usuarios</div>
              </motion.div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              🚀 Participar Ahora
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white font-bold py-4 px-12 rounded-2xl text-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300"
            >
              📋 Ver Proyectos
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <span className="text-xs font-medium">Desplázate</span>
        </div>
      </motion.div>
    </section>
  );
}
