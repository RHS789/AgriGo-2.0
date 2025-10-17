import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiCheck, FiX } from 'react-icons/fi';
import { listBookings } from '../../services/bookings.js';

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listBookings();
        setBookings(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (err) {
        console.error('Error loading bookings:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <motion.div data-aos="fade-up" className="card">
        <div className="card-body">
          <div className="h-40 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
          </div>
        </div>
      </motion.div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div
      data-aos="fade-up"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="card-body">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-emerald-600 text-xl" />
            <h3 className="font-semibold text-gray-900">Incoming Bookings</h3>
          </div>
          <Link to="/bookings" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            View All
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-6">No bookings yet</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Booking #{booking.id?.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500">
                    {booking.start_date && booking.end_date
                      ? `${new Date(booking.start_date).toLocaleDateString()} - ${new Date(booking.end_date).toLocaleDateString()}`
                      : 'Date pending'}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                  {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'pending'}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
