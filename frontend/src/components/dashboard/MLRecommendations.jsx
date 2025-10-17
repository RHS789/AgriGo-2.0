import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiTrendingUp, FiBolt } from 'react-icons/fi';
import { getRecommendations } from '../../services/ml.js';
import { getAuth } from '../../store/authStore.js';

export default function MLRecommendations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (auth?.user?.id) {
          const recs = await getRecommendations(auth.user.id);
          setItems(Array.isArray(recs) ? recs.slice(0, 3) : []);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('ML recommendations error:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [auth?.user?.id]);

  return (
    <motion.div
      data-aos="zoom-in"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card bg-gradient-to-br from-amber-50 to-orange-50"
    >
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <FiBolt className="text-amber-600 text-xl" />
          </motion.div>
          <h3 className="font-semibold text-gray-900">⚡ AI Recommendations</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-4">
            Start using AgriGo to get personalized AI recommendations 🤖
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <motion.li
                key={item.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(251, 146, 60, 0.1)' }}
                className="flex items-start gap-3 rounded-lg bg-white p-3 border border-amber-100 cursor-pointer transition-all"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                  className="mt-1"
                >
                  <FiStar className="text-amber-600" size={16} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title || item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((item.score || 0) * 100)}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      />
                    </div>
                    <p className="text-xs font-medium text-amber-600 whitespace-nowrap">
                      {((item.score || 0) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
