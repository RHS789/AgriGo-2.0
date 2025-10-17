import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiHeart, FiShare2 } from 'react-icons/fi';
import { supabase } from '../../lib/supabaseClient.js';

const mockTips = [
  { id: '1', content: '💧 Water your crops early morning for best results', created_at: new Date().toISOString(), author: 'AgriGo Team' },
  { id: '2', content: '🌿 Use crop rotation to maintain soil health', created_at: new Date(Date.now() - 86400000).toISOString(), author: 'Expert Farmer' },
  { id: '3', content: '🐛 Monitor for pests weekly during growing season', created_at: new Date(Date.now() - 172800000).toISOString(), author: 'AgriGo Team' }
];

export default function CommunityTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel;
    (async () => {
      setLoading(true);
      if (!supabase) {
        setTips(mockTips);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('tips').select('*').order('created_at', { ascending: false }).limit(10);
        if (!error && data && data.length > 0) {
          setTips(data);
        } else {
          setTips(mockTips);
        }

        channel = supabase.channel('tips-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'tips' }, (payload) => {
          setTips((t) => [payload.new, ...t].slice(0, 10));
        }).subscribe();
      } catch (err) {
        console.error('Community tips error:', err);
        setTips(mockTips);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
  }, []);

  return (
    <motion.div
      data-aos="slide-left"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="card bg-gradient-to-br from-indigo-50 to-purple-50 h-full"
    >
      <div className="card-body flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <FiMessageCircle className="text-indigo-600 text-lg" />
          <h3 className="font-semibold text-gray-900">💬 Community Tips</h3>
        </div>

        {loading ? (
          <div className="space-y-3 flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : tips.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-6">No tips available yet</p>
        ) : (
          <ul className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {tips.map((t, idx) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                className="rounded-lg border border-indigo-200 bg-white p-3 cursor-pointer transition-all hover:border-indigo-400"
              >
                <p className="text-sm text-gray-800 leading-relaxed">{t.content}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(t.created_at).toLocaleDateString()}</span>
                  <span className="font-medium text-indigo-600">{t.author || 'Community'}</span>
                </div>
                <div className="mt-2 flex items-center gap-3 pt-2 border-t border-indigo-100">
                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600 transition-colors">
                    <FiHeart size={14} /> Like
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600 transition-colors">
                    <FiShare2 size={14} /> Share
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
