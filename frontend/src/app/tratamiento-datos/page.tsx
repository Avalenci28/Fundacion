'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, UserCircle } from 'lucide-react'

export default function TratamientoDatosPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Manual de Tratamiento de Datos
              </h1>
            </div>

            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                Habeas Data
              </span>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                La Fundacion Malambo Sonrie, con domicilio en Malambo, Atlantico, Colombia, es la responsable del tratamiento de sus datos personales.
              </p>

              <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mt-8">
                Responsable del Tratamiento
              </h2>
              <p>
                Fundacion Malambo Sonrie<br />
                Malambo, Atlantico, Colombia<br />
                Correo electronico: malambosonrie@gmail.com
              </p>

              <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mt-8">
                Sus Derechos
              </h2>
              <p>
                Usted tiene derecho a conocer, actualizar y rectificar sus datos personales en cualquier momento. Para ejercer estos derechos, puede escribirnos a: <strong>malambosonrie@gmail.com</strong>.
              </p>

              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ultima actualizacion: Mayo 2026
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
