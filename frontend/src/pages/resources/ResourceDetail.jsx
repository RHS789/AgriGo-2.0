import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResource } from '../../services/resources.js';
import { createBooking } from '../../services/bookings.js';

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    quantity: 1
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try { setItem(await getResource(id)); }
      catch { setError('Failed to load resource'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const book = async () => {
    if (!formData.start_date || !formData.end_date) {
      setError('Please select both start and end dates');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await createBooking({
        resource_id: id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        quantity: formData.quantity,
        notes: ''
      });
      navigate('/bookings');
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main className="page">Loading...</main>;
  if (!item) return <main className="page text-red-600">{error || 'Resource not found'}</main>;

  return (
    <main className="page">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-body space-y-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">{item.name}</h1>
              <p className="text-gray-700 mb-4">{item.description}</p>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium text-gray-900">{item.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price per day</p>
                  <p className="font-medium text-gray-900">${item.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{item.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-emerald-600">{item.availability}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-900">Book this resource</h2>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  className="input"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  className="input"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                onClick={book}
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? 'Booking...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
