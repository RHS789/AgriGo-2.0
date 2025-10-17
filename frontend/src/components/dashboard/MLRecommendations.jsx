import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiTrendingUp } from 'react-icons/fi';
import { getRecommendations } from '../../services/ml.js';
import { getAuth } from '../../store/authStore.js';

export default function MLRecommendations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    (async () => {
      try {
        if (auth?.user?.id) {
          const recs = await getRecommendations(auth.user.id);
          setItems(Array.isArray(recs) ? recs.slice(0, 3) : []);
        }
      } catch (err) {
        console.error('ML recommendations error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [auth?.user?.id]);

  if (loading) {
    return (
      <motion.div data-aos="fade-up" className="card">
        <div className="card-body">
          <div className="h-32 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-aos="zoom-in"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="text-emerald-600 text-xl" />
          <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-gray-600">No recommendations available yet. Start using the platform to get personalized suggestions.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <motion.li
                key={item.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent p-3 border border-emerald-100"
              >
                <div className="mt-1">
                  <FiStar className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title || item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Score: {((item.score || 0) * 100).toFixed(0)}%
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
