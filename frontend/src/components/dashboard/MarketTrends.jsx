import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function MarketTrends() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const url = import.meta.env.VITE_MARKET_API_URL;
      if (!url) return;
      try {
        const res = await fetch(url);
        if (res.ok) setRows(await res.json());
      } catch {}
    })();
  }, []);

  return (
    <motion.div data-aos="fade-in" className="card">
      <div className="card-body">
        <h3 className="font-semibold text-gray-900 mb-3">Market Price Trends</h3>
        {rows.length === 0 ? (
          <p className="text-sm text-gray-600">Connect market API to display price trends.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27ae60" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#27ae60" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="#27ae60" fill="url(#greenGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
