import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiSettings, FiLogOut, FiMapPin } from 'react-icons/fi';
import { getProfile } from '../../services/auth.js';
import { clearAuth } from '../../store/authStore.js';
import { useNavigate } from 'react-router-dom';

export default function DashboardTopBar() {
  const [profile, setProfile] = useState(null);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    (async () => setProfile(await getProfile()))();
    const i = setInterval(()=> setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const greet = () => {
    const h = now.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
          {(profile?.name || profile?.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm text-gray-500">{now.toLocaleString()}</p>
          <p className="text-lg font-semibold text-gray-900">{greet()}, {profile?.name || 'Farmer'} 👨‍🌾</p>
          {profile?.location && (
            <p className="flex items-center gap-1 text-xs text-gray-600"><FiMapPin /> {profile.location}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-full p-2 hover:bg-gray-100"><FiBell /></button>
        <button className="rounded-full p-2 hover:bg-gray-100"><FiSettings /></button>
        <button className="rounded-full p-2 hover:bg-gray-100" onClick={()=>{ clearAuth(); navigate('/login'); }}><FiLogOut /></button>
      </div>
    </motion.div>
  );
}
