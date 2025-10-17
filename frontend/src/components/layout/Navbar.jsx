import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, clearAuth } from '../../store/authStore.js';

export default function Navbar() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const logout = () => { clearAuth(); setAuth(null); navigate('/login'); };

  return (
    <header className="bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-gray-200">
      <nav className="page flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-900">AgriGo</Link>
        <div className="flex items-center gap-4">
          <NavLink to="/resources" className={({isActive})=>`text-sm ${isActive? 'text-blue-600' : 'text-gray-700'}`}>Resources</NavLink>
          {auth && (
            <>
              <NavLink to="/dashboard" className={({isActive})=>`text-sm ${isActive? 'text-blue-600' : 'text-gray-700'}`}>Dashboard</NavLink>
              <NavLink to="/bookings" className={({isActive})=>`text-sm ${isActive? 'text-blue-600' : 'text-gray-700'}`}>Bookings</NavLink>
            </>
          )}
          {!auth ? (
            <div className="flex gap-2">
              <NavLink to="/login" className="btn-secondary">Login</NavLink>
              <NavLink to="/register" className="btn-primary">Register</NavLink>
            </div>
          ) : (
            <button onClick={logout} className="btn-secondary">Logout</button>
          )}
        </div>
      </nav>
    </header>
  );
}
