import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerApi, login as loginApi } from '../../services/auth.js';
import { setAuth } from '../../store/authStore.js';

export default function DemoAccountButton({ role = 'farmer', className = '' }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateDemo = async () => {
    setLoading(true);
    try {
      const timestamp = Date.now();
      const email = `demo${timestamp}@example.com`;
      const password = 'DemoPass123!';
      const name = `Demo User ${role}`;

      // Register
      await registerApi({ email, password, name, role });
      // Login
      const data = await loginApi(email, password);
      setAuth({ ...data });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Demo account creation failed', err);
      alert('Demo account creation failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateDemo}
      className={`btn btn-outline btn-sm ${className}`}
      disabled={loading}
    >
      {loading ? 'Creating...' : 'Demo account / Auto-create test user'}
    </button>
  );
}
