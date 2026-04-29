  'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react'
import { publicApi } from '@/lib/api'
import toast from 'react-hot-toast'

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await publicApi.submitContact(formData)
      toast.success('¡Mensaje enviado con éxito! Te responderemos pronto.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al enviar el mensaje')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Contáctanos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Estamos aquí para escucharte. Escríbenos y únete a la transformación de Malambo.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <AnimatedSection>
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-3xl p-8 text-white">
                <h2 className="font-display text-2xl font-bold mb-6">Información de Contacto</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Dirección</h3>
                      <p className="text-white/80">Malambo, Atlántico, Colombia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Teléfono</h3>
                      <p className="text-white/80">+57 300 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Correo Electrónico</h3>
                      <p className="text-white/80">hola@malambosonrie.org</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horario de Atención</h3>
                      <p className="text-white/80">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="font-display text-xl font-bold mb-6 text-gray-900 dark:text-white">
                  Síguenos en Redes
                </h3>
                <div className="flex gap-4">
                  {[
                    {        label: 'Facebook', color: 'bg-blue-600' },
                    {        label: 'Instagram', color: 'bg-pink-600' },
                    {        label: 'Twitter', color: 'bg-sky-500' },
                  ].map((social) => (
                    <button
                      key={social.label}
                      className={`${social.color} w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform`}
                      title={social.label}
                    >
                      {/* <social.icon className="w-6 h-6" /> */}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection>
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 space-y-6"
            >
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Envíanos un Mensaje
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="+57 300 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="¿De qué se trata?"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

