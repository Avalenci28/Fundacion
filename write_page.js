const fs = require('fs');
const content = `'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Mission Vision Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-32 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Mission */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="text-5xl">🎯</div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                Nuestra Misión
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Promover el bienestar, la participación ciudadana y el desarrollo de Malambo, 
                creando espacios de unión, solidaridad y oportunidades para todos.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-12 rounded-3xl shadow-2xl">
                <div className="text-5xl mb-6">👁️</div>
                <h2 className="text-3xl md:text-4xl font-black mb-6">
                  Nuestra Visión
                </h2>
                <p className="text-xl leading-relaxed opacity-95">
                  Ser una comunidad inclusiva, empoderada y solidaria, donde todos tengan el 
                  poder de participar y construir un futuro mejor sin dejar a nadie atrás.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* What We Do Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
              ¿Qué Hacemos?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Cuatro pilares que transforman nuestra comunidad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🤝',
                title: 'Proyectos Sociales',
                description: 'Actividades que mejoran la calidad de vida de las personas en situaciones vulnerables.',
                color: 'from-pink-500 to-pink-600'
              },
              {
                icon: '🎉',
                title: 'Eventos y Actividades',
                description: 'Cultura, deporte, educación y recreación para toda la familia.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: '🌿',
                title: 'Cuidado del Entorno',
                description: 'Iniciativas ambientales y embellecimiento urbano para un Malambo más verde.',
                color: 'from-emerald-500 to-emerald-600'
              },
              {
                icon: '🗣️',
                title: 'Participación Ciudadana',
                description: 'Espacios donde las personas pueden expresar su voz y tomar decisiones.',
                color: 'from-blue-500 to-blue-600'
              }
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer p-10 rounded-3xl bg-gradient-to-br bg-white shadow-xl hover:shadow-2xl border border-gray-100 hover:border-pink-200 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-pink-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspirational Quote */}
      <motion.section 
        className="py-32 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-2xl md:text-3xl font-light italic mb-8 opacity-90">
              "Cada pequeña acción cuenta. Juntos hacemos de Malambo un mejor lugar para vivir."
            </div>
            <div className="text-6xl">💖</div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
              ¿Listo para unirte?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Tu participación hace la diferencia. Únete a nuestra comunidad y sé parte del cambio.
            </p>
            <div className="flex justify-center">
              <Link href="/registro">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 px-12 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  🚀 Registrarse como Voluntario
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
`;
fs.writeFileSync('c:/Users/andre/OneDrive/Documentos/WEB FUNDACION/frontend/src/app/page.tsx', content, 'utf8');
console.log('Archivo guardado correctamente');
