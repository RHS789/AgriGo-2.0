import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth.js';
import { setAuth } from '../../store/authStore.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await login(email, password);
      setAuth({ token: data.token, user: data.user });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <main className="page">
      <div className="mx-auto max-w-md card mt-16">
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Log In</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-accent-green w-full text-white" disabled={loading}>{loading? 'Logging in...' : 'Log In'}</button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">New here? <Link to="/register" className="text-[#27ae60]">Sign Up</Link></p>
        </div>
      </div>
    </main>
  );
}
