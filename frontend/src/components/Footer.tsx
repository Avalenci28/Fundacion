'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'
import SocialLinks from '@/components/SocialLinks'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Brand - Left Side */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Fundacion Malambo Sonrie" width={32} height={32} className="drop-shadow-lg" />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg">Malambo</span>
                <span className="font-display font-bold text-sm text-primary-400 -mt-1">Sonrie!</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Conectando corazones, construyendo comunidad. Juntos hacemos de Malambo un mejor lugar para vivir.
            </p>
            <SocialLinks />
          </div>

          {/* Contact - Right Side */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-display font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                <span className="text-gray-400 text-sm">Malambo, Atlantico, Colombia</span>
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

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-4">
            <Link href="/privacidad" className="text-gray-500 hover:text-gray-400 transition-colors text-xs">
              Politica de Privacidad
            </Link>
            <Link href="/terminos" className="text-gray-500 hover:text-gray-400 transition-colors text-xs">
              Terminos y Condiciones
            </Link>
            <Link href="/tratamiento-datos" className="text-gray-500 hover:text-gray-400 transition-colors text-xs">
              Tratamiento de Datos Personales
            </Link>
          </div>
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Malambo Sonrie. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}