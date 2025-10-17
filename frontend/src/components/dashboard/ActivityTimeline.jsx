import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import { listBookings } from '../../services/bookings.js';

const statusConfig = {
  pending: { icon: FiClock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  confirmed: { icon: FiCheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Confirmed' },
  completed: { icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
  cancelled: { icon: FiXCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' }
};

export default function ActivityTimeline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const bookings = await listBookings().catch(() => []);
        const mapped = (bookings || []).slice(0, 6).map(b => {
          const status = b.status || 'pending';
          return {
            id: b.id,
            title: `Resource Booking`,
            time: b.created_at || b.start_date || new Date().toISOString(),
            status: status,
            detail: statusConfig[status]?.label || status
          };
        });
        setItems(mapped);
      } catch (err) {
        console.error('Activity timeline error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <motion.div
      data-aos="fade-up"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="card bg-gradient-to-br from-slate-50 to-slate-100"
    >
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="text-slate-600 text-lg" />
          <h3 className="font-semibold text-gray-900">📅 Farm Activity</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-6">No recent activity yet</p>
        ) : (
          <ul className="space-y-3">
            {items.map((it, idx) => {
              const config = statusConfig[it.status] || statusConfig.pending;
              const StatusIcon = config.icon;

              return (
                <motion.li
                  key={it.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(226, 232, 240, 0.8)' }}
                  className="relative pl-8 pr-3 py-3 rounded-lg bg-white border border-slate-200 transition-all hover:shadow-md"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${config.color}`}
                  >
                    <StatusIcon size={18} />
                  </motion.span>

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{it.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(it.time).toLocaleDateString()} at {new Date(it.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${config.bg} ${config.color}`}
                    >
                      {it.detail}
                    </motion.span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
