'use client'

import Link from 'next/link'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
<img src="/logo.svg" alt="Fundación Malambo Sonríe" className="w-8 h-8 drop-shadow-lg" />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg">Malambo</span>
                <span className="font-display font-bold text-sm text-primary-400 -mt-1">Sonríe!</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Conectando corazones, construyendo comunidad. Juntos hacemos de Malambo un mejor lugar para vivir.
            </p>

            {/* ICONOS ARREGLADOS */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <span className="text-sm font-bold">FB</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <span className="text-sm font-bold">IG</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <span className="text-sm font-bold">TW</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/proyectos', label: 'Proyectos' },
                { href: '/eventos', label: 'Eventos' },
                { href: '/blog', label: 'Blog' },
                { href: '/galeria', label: 'Galería' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Proyectos</h3>
            <ul className="space-y-3">
              {[
                'Huerta Comunitaria',
                'Biblioteca Itinerante',
                'Capacitación Digital',
                'Escuela de Arte',
                'Salud Preventiva',
              ].map((project) => (
                <li key={project}>
                  <Link href="/proyectos" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                    {project}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                <span className="text-gray-400 text-sm">Malambo, Atlántico, Colombia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500" />
                <span className="text-gray-400 text-sm">+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500" />
                <span className="text-gray-400 text-sm">info@malambosonrie.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Malambo Sonríe. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}