import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';
import CountUp from './CountUp.jsx';
import { listResources } from '../../services/resources.js';

export default function ProviderStats() {
  const [stats, setStats] = useState({
    totalResources: 0,
    totalEarnings: 0,
    activeBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resources = await listResources();
        const userResources = resources || [];
        
        setStats({
          totalResources: userResources.length,
          totalEarnings: userResources.reduce((sum, r) => sum + (r.price || 0), 0),
          activeBookings: Math.floor(Math.random() * 10), // Mock data
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = [
    {
      label: 'Active Resources',
      value: stats.totalResources,
      color: 'emerald',
    },
    {
      label: 'Total Earnings',
      value: stats.totalEarnings,
      prefix: '$',
      color: 'green',
    },
    {
      label: 'Active Bookings',
      value: stats.activeBookings,
      color: 'blue',
    },
  ];

  if (loading) {
    return (
      <motion.div data-aos="fade-up" className="card">
        <div className="card-body">
          <div className="h-20 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-aos="fade-up"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="card-body">
        <div className="flex items-center gap-2 mb-6">
          <FiTrendingUp className="text-emerald-600 text-xl" />
          <h3 className="font-semibold text-gray-900">Provider Overview</h3>
        </div>

        <div className="grid gap-4">
          {statCards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <p className="text-sm text-gray-600">{card.label}</p>
              <div className="text-right">
                <CountUp
                  to={card.value}
                  className="text-2xl font-bold text-gray-900"
                  duration={1}
                />
                {card.prefix && <span className="text-lg font-bold text-gray-900">{card.prefix}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
