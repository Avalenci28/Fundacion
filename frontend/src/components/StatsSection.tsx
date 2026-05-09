import { motion } from 'framer-motion';
import { Users, Folder, Calendar, Heart } from 'lucide-react';
import { useQuery } from 'react-query';
import { publicApi } from '@/lib/api';

export default function StatsSection() {
  const { data: stats, isLoading } = useQuery('publicStats', () =>
    publicApi.getPublicStats().then(res => res.data.stats)
  );

  const statsData = [
    {
      value: stats?.projectsCompleted || 0,
      label: 'Proyectos Completados',
      icon: Folder,
      color: 'from-pink-500 to-rose-500'
    },
    {
      value: stats?.eventsUpcoming || 0,
      label: 'Eventos Próximos',
      icon: Calendar,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      value: stats?.volunteers || 0,
      label: 'Voluntarios Activos',
      icon: Users,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      value: stats?.peopleHelped || 0,
      label: 'Personas Ayudadas',
      icon: Heart,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-32 bg-white"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
            Nuestro Impacto
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Números que reflejan el poder de la comunidad unida
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center p-8 bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 hover:border-pink-200 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <motion.div 
                className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
                initial={{ scale: 1 }}
                whileInView={{ scale: 1.1 }}
                viewport={{ once: true }}
              >
                {stat.value.toLocaleString()}
              </motion.div>
              <div className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

