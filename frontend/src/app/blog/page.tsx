'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BlogPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center"><p>Redirigiendo...</p></div>
      </div>
    </div>
  )
}
