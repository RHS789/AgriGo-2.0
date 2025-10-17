import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSeedling, FaTractor, FaFlask, FaTint } from 'react-icons/fa';
import CountUp from './CountUp.jsx';
import { listResources } from '../../services/resources.js';
import { listBookings } from '../../services/bookings.js';

const cards = [
  { key: 'fertilizers', label: 'Fertilizers', icon: FaFlask },
  { key: 'seeds', label: 'Seeds', icon: FaSeedling },
  { key: 'equipment', label: 'Equipment', icon: FaTractor },
  { key: 'water', label: 'Water', icon: FaTint }
];

export default function ResourceStats() {
  const [stats, setStats] = useState({ fertilizers: 0, seeds: 0, equipment: 0, water: 0, bookings: 0 });

  useEffect(() => {
    (async () => {
      try {
        const resources = await listResources();
        const bookings = await listBookings().catch(()=>[]);
        setStats(s => ({
          ...s,
          equipment: resources?.length || 0,
          bookings: bookings?.length || 0
        }));
      } catch {}
    })();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div key={c.key} data-aos="zoom-in" className="card">
            <div className="card-body flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{c.label}</p>
                <CountUp to={stats[c.key] || 0} className="text-2xl font-bold text-gray-900" />
              </div>
              <Icon className="text-emerald-600 text-2xl" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
