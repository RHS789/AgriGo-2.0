import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listBookings } from '../../services/bookings.js';

export default function Bookings() {
  const [items, setItems] = useState([]);

  useEffect(() => { (async ()=> setItems(await listBookings()))(); }, []);

  return (
    <main className="page">
      <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
      <div className="space-y-3">
        {items.map(b => (
          <div key={b.id} className="card"><div className="card-body flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Booking #{b.id}</p>
              <p className="text-sm text-gray-600">Status: {b.status}</p>
            </div>
            <Link to={`/chat/${b.id}`} className="btn-primary">Open Chat</Link>
          </div></div>
        ))}
      </div>
    </main>
  );
}
