import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listResources } from '../../services/resources.js';

export default function Resources() {
  const [items, setItems] = useState([]);

  useEffect(() => { (async ()=> setItems(await listResources()))(); }, []);

  return (
    <main className="page">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Resources</h1>
        <Link to="/resources/new" className="btn-primary">Add Resource</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(r => (
          <Link key={r.id} to={`/resources/${r.id}`} className="card">
            <div className="card-body">
              <h3 className="font-medium text-gray-800">{r.title || r.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{r.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
