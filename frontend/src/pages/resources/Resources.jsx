import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listResources } from '../../services/resources.js';

export default function Resources() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await listResources();
        setItems(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        setError('Failed to load resources');
        console.error('Load resources error:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Available Resources</h1>
        <Link to="/resources/new" className="btn-primary">Add Resource</Link>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No resources available yet.</p>
          <Link to="/resources/new" className="btn-primary">Create the first resource</Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(r => (
          <Link key={r.id} to={`/resources/${r.id}`} className="card hover:shadow-md transition-shadow">
            <div className="card-body">
              <h3 className="font-semibold text-gray-900 mb-2">{r.name || r.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{r.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{r.type}</span>
                <span className="font-medium text-emerald-600">${r.price}/day</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
