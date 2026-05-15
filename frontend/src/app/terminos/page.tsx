'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function TerminosPage() {
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
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Terminos y Condiciones de Uso
              </h1>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                Al navegar en este sitio, el usuario acepta el uso correcto de la informacion aqui presentada. El contenido de malambosonrie@gmail.com es propiedad de la Fundacion Malambo Sonrie.
              </p>

              <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mt-8">
                Propiedad Intelectual
              </h2>
              <p>
                Queda prohibida la reproduccion total o parcial del material sin autorizacion escrita previa. La fundacion se reserva el derecho de actualizar los proyectos y eventos publicados.
              </p>

              <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mt-8">
                Uso Apropiado
              </h2>
              <p>
                Los usuarios se comprometen a utilizar el sitio web de manera responsable. No esta permitido utilizar el contenido para fines ilegales o no autorizados.
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
