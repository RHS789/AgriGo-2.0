import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Resources from './pages/resources/Resources.jsx';
import ResourceDetail from './pages/resources/ResourceDetail.jsx';
import ResourceCreate from './pages/resources/ResourceCreate.jsx';
import Bookings from './pages/bookings/Bookings.jsx';
import Chat from './pages/chat/Chat.jsx';
import NotFound from './pages/NotFound.jsx';
import { useAuthInit } from './store/authStore.js';

export default function App() {
  useAuthInit();

  useEffect(() => {
    document.title = 'AgriGo 2.0';
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/new" element={<ProtectedRoute><ResourceCreate /></ProtectedRoute>} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/chat/:bookingId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
