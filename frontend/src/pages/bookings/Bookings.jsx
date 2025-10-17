import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listBookings } from '../../services/bookings.js';

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await listBookings();
        setItems(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        setError('Failed to load bookings');
        console.error('Load bookings error:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-600 bg-emerald-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <main className="page">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage and track your resource bookings</p>
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
          <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
          <Link to="/resources" className="btn-primary">Browse Resources</Link>
        </div>
      )}

      <div className="space-y-3">
        {items.map(b => (
          <div key={b.id} className="card hover:shadow-md transition-shadow">
            <div className="card-body flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-gray-900">Booking #{b.id?.slice(0, 8)}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(b.status)}`}>
                    {b.status?.charAt(0).toUpperCase() + b.status?.slice(1) || 'pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {b.start_date && b.end_date ?
                    `${new Date(b.start_date).toLocaleDateString()} - ${new Date(b.end_date).toLocaleDateString()}` :
                    'Date information unavailable'
                  }
                </p>
              </div>
              <Link to={`/chat/${b.id}`} className="btn-primary">Open Chat</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
