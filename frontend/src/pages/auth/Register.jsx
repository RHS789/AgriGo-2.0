import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../../services/auth.js';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await registerApi(form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <main className="page">
      <div className="mx-auto max-w-md card">
        <div className="card-body">
          <h1 className="text-2xl font-semibold mb-4">Register</h1>
          <form onSubmit={onSubmit} className="space-y-3">
            <input className="input" placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required />
            <select className="input" value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
              <option value="farmer">Farmer</option>
              <option value="resource_provider">Resource Provider</option>
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>{loading? 'Creating...' : 'Create Account'}</button>
          </form>
          <p className="mt-3 text-sm text-gray-600">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
        </div>
      </div>
    </main>
  );
}
