import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  icons: {
    icon: '/Gemini_Generated_Image_l9i6p3l9i6p3l9i6p3l9i6.png',
  },
  title: 'Malambo Sonríe - Conectando corazones, construyendo comunidad',
  description: 'Iniciativa social enfocada en mejorar la calidad de vida de las personas mediante actividades comunitarias, proyectos sociales y participación ciudadana.',
  keywords: ['Malambo', 'organización social', 'voluntariado', 'comunidad', 'proyectos sociales'],
  other: {
    'mobile-web-app-capable': 'yes',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/Gemini_Generated_Image_l9i6p3l9i6p3l9i6p3l9i6.png" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

