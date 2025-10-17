import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../../services/auth.js';

const roles = [
  { key: 'farmer', label: 'Farmer' },
  { key: 'resource_provider', label: 'Provider' }
];

export default function Register() {
  const [role, setRole] = useState('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const name = email.split('@')[0] || 'User';
      await registerApi({ name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <main className="page">
      <div className="mx-auto max-w-md card mt-16">
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Sign Up</h1>

          <div className="flex gap-2 mb-5">
            {roles.map(r => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`tab ${role===r.key? 'tab-active' : ''}`}
              >{r.label}</button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <input className="input" type="password" placeholder="Confirm Password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-accent-green w-full text-white" disabled={loading}>{loading? 'Creating...' : 'Sign Up'}</button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">Already have an account? <Link to="/login" className="text-[#27ae60]">Log in</Link></p>
        </div>
      </div>
    </main>
  );
}
