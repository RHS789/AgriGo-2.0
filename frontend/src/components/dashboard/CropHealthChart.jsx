import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { supabase } from '../../lib/supabaseClient.js';

const mockTelemetry = [
  { timestamp: new Date(Date.now() - 300000).toISOString(), soil_moisture: 65, ph: 7.2, growth: 45 },
  { timestamp: new Date(Date.now() - 240000).toISOString(), soil_moisture: 68, ph: 7.1, growth: 48 },
  { timestamp: new Date(Date.now() - 180000).toISOString(), soil_moisture: 70, ph: 7.3, growth: 52 },
  { timestamp: new Date(Date.now() - 120000).toISOString(), soil_moisture: 72, ph: 7.2, growth: 55 },
  { timestamp: new Date(Date.now() - 60000).toISOString(), soil_moisture: 71, ph: 7.4, growth: 58 },
  { timestamp: new Date().toISOString(), soil_moisture: 73, ph: 7.3, growth: 60 }
];

export default function CropHealthChart() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription;
    (async () => {
      setLoading(true);
      if (!supabase) {
        setRows(mockTelemetry);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('telemetry').select('*').order('timestamp', { ascending: true }).limit(50);
        if (!error && data && data.length > 0) {
          setRows(data);
        } else {
          setRows(mockTelemetry);
        }

        subscription = supabase.channel('telemetry-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'telemetry' }, (payload) => {
          setRows((r) => [...r, payload.new].slice(-50));
        }).subscribe();
      } catch (err) {
        console.error('Telemetry error:', err);
        setRows(mockTelemetry);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (subscription) supabase?.removeChannel(subscription);
    };
  }, []);

  return (
    <motion.div
      data-aos="fade-right"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="card bg-gradient-to-br from-cyan-50 to-green-50"
    >
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">🌾 Crop Health Insights</h3>
          {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />}
        </div>

        {loading && rows.length === 0 ? (
          <div className="h-72 bg-gray-100 rounded animate-pulse" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-600 py-8 text-center">No telemetry data available yet</p>
        ) : (
          <div className="h-72 overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%" minWidth={300}>
              <LineChart
                data={rows}
                margin={{ top: 10, right: 20, left: -20, bottom: 40 }}
              >
                <defs>
                  <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#27ae60" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#27ae60" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  yAxisId="left"
                  label={{ value: 'Moisture & pH', angle: -90, position: 'insideLeft', offset: 10 }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Growth %', angle: 90, position: 'insideRight' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value, name) => {
                    if (name === 'soil_moisture' || name === 'ph') return `${value.toFixed(1)}`;
                    return `${value.toFixed(0)}%`;
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="soil_moisture"
                  stroke="#27ae60"
                  dot={false}
                  name="Soil Moisture (%)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ph"
                  stroke="#2563eb"
                  dot={false}
                  name="pH Level"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growth"
                  stroke="#f59e0b"
                  dot={false}
                  name="Growth Rate (%)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
