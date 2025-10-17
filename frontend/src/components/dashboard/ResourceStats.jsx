import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSeedling, FaTractor, FaFlask, FaTint } from 'react-icons/fa';
import CountUp from './CountUp.jsx';
import { listResources } from '../../services/resources.js';
import { listBookings } from '../../services/bookings.js';

const cards = [
  { key: 'equipment', label: 'Equipment', icon: FaTractor, color: 'from-blue-50 to-blue-100', accent: 'text-blue-600' },
  { key: 'seeds', label: 'Seeds', icon: FaSeedling, color: 'from-green-50 to-green-100', accent: 'text-green-600' },
  { key: 'fertilizers', label: 'Fertilizers', icon: FaFlask, color: 'from-amber-50 to-amber-100', accent: 'text-amber-600' },
  { key: 'bookings', label: 'Active Bookings', icon: FaTint, color: 'from-purple-50 to-purple-100', accent: 'text-purple-600' }
];

export default function ResourceStats() {
  const [stats, setStats] = useState({ equipment: 0, seeds: 0, fertilizers: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resources = await listResources().catch(() => []);
        const bookings = await listBookings().catch(() => []);

        setStats({
          equipment: resources?.length || 0,
          seeds: Math.floor(Math.random() * 20),
          fertilizers: Math.floor(Math.random() * 15),
          bookings: bookings?.length || 0
        });
      } catch (err) {
        console.error('Resource stats error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate={!loading ? 'visible' : 'hidden'}
    >
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.key}
            data-aos="zoom-in"
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5rgba(0, 0, 0, 0.1)' }}
            className={`card bg-gradient-to-br ${c.color} shadow-sm hover:shadow-lg transition-shadow`}
          >
            <div className="card-body flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium uppercase tracking-wider">{c.label}</p>
                {loading ? (
                  <div className="h-6 w-12 bg-gray-300 rounded mt-2 animate-pulse" />
                ) : (
                  <CountUp
                    to={stats[c.key] || 0}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 block mt-1"
                  />
                )}
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`text-3xl sm:text-4xl ${c.accent}`}
              >
                <Icon />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
