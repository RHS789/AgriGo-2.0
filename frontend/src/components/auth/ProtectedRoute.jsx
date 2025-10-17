import { Navigate } from 'react-router-dom';
import { getAuth } from '../../store/authStore.js';

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  if (!auth?.token) return <Navigate to="/login" replace />;
  return children;
}
