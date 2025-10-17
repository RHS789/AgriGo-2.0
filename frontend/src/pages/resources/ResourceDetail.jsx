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

  useEffect(() => {
    (async () => {
      try { setItem(await getResource(id)); }
      catch { setError('Failed to load'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const book = async () => {
    try {
      await createBooking({ resource_id: id });
      navigate('/bookings');
    } catch {
      setError('Booking failed');
    }
  };

  if (loading) return <main className="page">Loading...</main>;
  if (error) return <main className="page text-red-600">{error}</main>;

  return (
    <main className="page">
      <div className="card"><div className="card-body space-y-3">
        <h1 className="text-2xl font-semibold">{item?.title || item?.name}</h1>
        <p className="text-gray-700">{item?.description}</p>
        <div className="flex gap-2">
          <button onClick={book} className="btn-primary">Book</button>
        </div>
      </div></div>
    </main>
  );
}
