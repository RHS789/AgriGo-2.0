import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function MarketTrends() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const url = import.meta.env.VITE_MARKET_API_URL;
      if (!url) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setRows(Array.isArray(data) ? data : []);
        } else {
          setError('Failed to fetch market data');
        }
      } catch (err) {
        console.error('Market API error:', err);
        setError('Unable to load market trends');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <motion.div
      data-aos="fade-left"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="card"
    >
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">📈 Market Price Trends</h3>
          {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />}
        </div>

        {loading ? (
          <div className="h-72 bg-gray-100 rounded animate-pulse" />
        ) : error ? (
          <p className="text-sm text-red-600 py-8 text-center">{error}</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-600 py-8 text-center">No market data available. Configure VITE_MARKET_API_URL.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={rows}
                margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27ae60" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#27ae60" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `₹${value.toFixed(2)}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#27ae60"
                  fill="url(#greenGrad)"
                  name="Price (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
