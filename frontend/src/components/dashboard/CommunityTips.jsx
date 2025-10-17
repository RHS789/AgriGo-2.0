import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient.js';

export default function CommunityTips() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    let channel;
    (async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from('tips').select('*').order('created_at', { ascending: false }).limit(10);
      if (!error && data) setTips(data);
      channel = supabase.channel('tips-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tips' }, (payload) => {
          setTips((t) => [payload.new, ...t].slice(0, 10));
        }).subscribe();
    })();
    return () => { channel && supabase?.removeChannel(channel); };
  }, []);

  return (
    <motion.div data-aos="slide-left" className="card h-full">
      <div className="card-body">
        <h3 className="font-semibold text-gray-900 mb-3">Community & Tips</h3>
        {tips.length === 0 ? (
          <p className="text-sm text-gray-600">No tips yet.</p>
        ) : (
          <ul className="space-y-3 max-h-72 overflow-y-auto">
            {tips.map((t) => (
              <li key={t.id} className="rounded-md border border-gray-100 p-3">
                <p className="text-sm text-gray-800">{t.content}</p>
                <p className="mt-1 text-xs text-gray-500">{new Date(t.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
