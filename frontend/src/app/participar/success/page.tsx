'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, Calendar, Users, Rocket } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md w-full"
      >
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl">
          <CheckCircle2 className="w-20 h-20 text-white" />
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
          ¡Solicitud Enviada!
        </h1>
        
        <p className="text-xl text-gray-600 mb-2 leading-relaxed">
          Hemos recibido tu solicitud de participación. 
        </p>
        <p className="text-xl text-gray-600 mb-12">
          Nuestro equipo revisará tu perfil en las próximas 24 horas y te contactará pronto.
        </p>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Próximos pasos
          </h3>
          <div className="space-y-4 text-left text-lg">
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <span>Revisión (24h)</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span>Contacto coordinador</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl">
              <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-purple-600" />
              </div>
              <span>Onboarding + primera actividad</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-2xl border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Inicio
            </motion.button>
          </Link>
          <Link href="/eventos">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg"
            >
              Ver Eventos
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-12">
          ¿Tienes dudas? Escríbenos a <span className="font-semibold text-purple-600 hover:underline cursor-pointer">contacto@malambosonrie.org</span>
        </p>
      </motion.div>
    </div>
  )
}

