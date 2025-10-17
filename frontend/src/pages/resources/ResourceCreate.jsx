import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createResource } from '../../services/resources.js';

export default function ResourceCreate() {
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await createResource(form); navigate('/resources'); }
    catch { setError('Creation failed (requires provider role)'); }
    finally { setLoading(false); }
  };

  return (
    <main className="page">
      <div className="mx-auto max-w-lg card"><div className="card-body">
        <h1 className="text-2xl font-semibold mb-4">Add Resource</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
          <textarea className="input min-h-[120px]" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary" disabled={loading}>{loading? 'Saving...' : 'Create'}</button>
        </form>
      </div></div>
    </main>
  );
}
