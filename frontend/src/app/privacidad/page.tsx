'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacidadPage() {
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
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Politica de Privacidad
              </h1>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                En cumplimiento de la Ley 1581 de 2012, informamos que los datos personales recolectados a traves de nuestra web seran tratados de manera segura. Nuestra prioridad es proteger la privacidad de nuestros donaciones, voluntarios y beneficiarios.
              </p>

              <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mt-8">
                Proteccion de Datos
              </h2>
              <p>
                No compartimos informacion con terceros sin autorizacion previa. Toda la informacion personal recopilada se almacena de forma segura y se utiliza unicamente para los fines especificos para los cuales fue proporcionada.
              </p>

              <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mt-8">
                Tus Derechos
              </h2>
              <p>
                Como usuario de este sitio web, tienes derecho a acceder, corregir y eliminar tus datos personales en cualquier momento. Para ejercer estos derechos, puedes contactarnos a traves de nuestra pagina de contacto.
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
