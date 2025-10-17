import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProfile } from '../services/auth.js';
import { getRecommendations } from '../services/ml.js';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    (async () => {
      const p = await getProfile();
      setProfile(p);
      const r = await getRecommendations(p.id);
      setRecs(r);
    })();
  }, []);

  return (
    <main className="page space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <section className="grid gap-4 md:grid-cols-3">
        <motion.div layout className="card"><div className="card-body">
          <h2 className="font-medium text-gray-800">Welcome</h2>
          <p className="text-gray-600 text-sm">{profile ? `Hello, ${profile.name}` : 'Loading...'}</p>
        </div></motion.div>
        <motion.div layout className="card md:col-span-2"><div className="card-body">
          <h2 className="font-medium text-gray-800 mb-2">Recommendations</h2>
          <ul className="space-y-2">
            {recs.map(r => (
              <li key={r.id} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <span className="text-gray-800">{r.title}</span>
                <span className="text-xs text-gray-500">{(r.score*100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div></motion.div>
      </section>
    </main>
  );
}
