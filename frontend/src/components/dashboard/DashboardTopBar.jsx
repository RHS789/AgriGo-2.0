import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiSettings, FiLogOut, FiMapPin } from 'react-icons/fi';
import { getProfile } from '../../services/auth.js';
import { clearAuth } from '../../store/authStore.js';
import { useNavigate } from 'react-router-dom';

export default function DashboardTopBar() {
  const [profile, setProfile] = useState(null);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const prof = await getProfile();
        setProfile(prof || {});
      } catch (err) {
        console.error('Profile load error:', err);
        setProfile({});
      } finally {
        setLoading(false);
      }
    })();
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const greet = () => {
    const h = now.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const avatar = (profile?.name || profile?.email || 'U').charAt(0).toUpperCase();

  return (
    <motion.div
      data-aos="fade-down"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-lg shadow-md"
        >
          {avatar}
        </motion.div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{now.toLocaleDateString()} • {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {greet()}, {loading ? '...' : (profile?.name || 'Farmer')} 👨‍🌾
          </p>
          {profile?.location && (
            <p className="flex items-center gap-1 text-xs text-gray-600 mt-1">
              <FiMapPin size={12} /> {profile.location}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          title="Notifications"
        >
          <FiBell size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          title="Settings"
        >
          <FiSettings size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="rounded-full p-2 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
          title="Logout"
        >
          <FiLogOut size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}
