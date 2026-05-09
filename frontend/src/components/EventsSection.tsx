import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useQuery } from 'react-query';
import { publicApi } from '@/lib/api';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  type: string;
}

export default function EventsSection() {
  const { data: events, isLoading } = useQuery('featuredEvents', () =>
    publicApi.getFeaturedEvents().then(res => res.data)
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-32 bg-gradient-to-r from-purple-50 to-pink-50"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Próximos Eventos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Únete a nuestras actividades comunitarias y sé parte del cambio en Malambo
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events?.slice(0, 6).map((event: Event, index: number) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 hover:border-purple-200 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="h-56 bg-gradient-to-br from-purple-500 to-pink-600 relative overflow-hidden">
                  <img 
                    src={event.image || '/api/placeholder/400/300'} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    {event.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {event.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(event.date).toLocaleDateString('es-CO', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            Ver Todos los Eventos
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
