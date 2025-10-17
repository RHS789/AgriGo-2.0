import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, clearAuth } from '../../store/authStore.js';

export default function Navbar() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const logout = () => { clearAuth(); setAuth(null); navigate('/login'); };

  return (
    <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
      <nav className="page flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-gray-900">AgriGo</Link>
        <div className="flex items-center gap-3">
          {!auth ? (
            <>
              <NavLink to="/login" className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">Login</NavLink>
              <NavLink to="/register" className="btn-accent-green text-white text-sm">Sign Up</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={({isActive})=>`px-3 py-2 text-sm ${isActive? 'text-emerald-600' : 'text-gray-700'}`}>Dashboard</NavLink>
              <NavLink to="/resources" className={({isActive})=>`px-3 py-2 text-sm ${isActive? 'text-emerald-600' : 'text-gray-700'}`}>Resources</NavLink>
              <NavLink to="/bookings" className={({isActive})=>`px-3 py-2 text-sm ${isActive? 'text-emerald-600' : 'text-gray-700'}`}>Bookings</NavLink>
              <button onClick={logout} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
