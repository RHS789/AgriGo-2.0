import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listBookings } from '../../services/bookings.js';

export default function ActivityTimeline() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const bookings = await listBookings().catch(()=>[]);
      const mapped = (bookings || []).slice(0, 6).map(b => ({
        id: b.id,
        title: `Booking ${b.id}`,
        time: b.created_at || b.start_date || '',
        detail: `Status: ${b.status}`
      }));
      setItems(mapped);
    })();
  }, []);

  return (
    <motion.div data-aos="fade-up" className="card">
      <div className="card-body">
        <h3 className="font-semibold text-gray-900 mb-3">Farm Activity</h3>
        <ul className="space-y-4">
          {items.length === 0 && <li className="text-sm text-gray-600">No recent activity.</li>}
          {items.map((it, idx) => (
            <motion.li key={it.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="relative pl-6">
              <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-[#27ae60]" />
              <p className="text-sm font-medium text-gray-900">{it.title}</p>
              <p className="text-xs text-gray-500">{it.time ? new Date(it.time).toLocaleString() : ''}</p>
              <p className="text-xs text-gray-600">{it.detail}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
