import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { supabase } from '../../lib/supabaseClient.js';

export default function CropHealthChart() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let subscription;
    (async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from('telemetry').select('*').order('timestamp', { ascending: true }).limit(50);
      if (!error && data) setRows(data);
      subscription = supabase.channel('telemetry-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'telemetry' }, (payload) => {
          setRows((r) => [...r, payload.new].slice(-50));
        }).subscribe();
    })();
    return () => { subscription && supabase?.removeChannel(subscription); };
  }, []);

  return (
    <motion.div data-aos="fade-right" className="card">
      <div className="card-body">
        <h3 className="font-semibold text-gray-900 mb-3">Crop Health Insights</h3>
        {rows.length === 0 ? (
          <p className="text-sm text-gray-600">No telemetry yet.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(t)=> new Date(t).toLocaleTimeString()} />
                <YAxis />
                <Tooltip labelFormatter={(l)=> new Date(l).toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="soil_moisture" stroke="#27ae60" dot={false} name="Soil Moisture" />
                <Line type="monotone" dataKey="ph" stroke="#2563eb" dot={false} name="pH" />
                <Line type="monotone" dataKey="growth" stroke="#f59e0b" dot={false} name="Growth" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
