import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMapPin, FiEdit2, FiSave, FiX, FiLogOut } from 'react-icons/fi';
import { getProfile, getAuth, setAuth, clearAuth } from '../store/authStore.js';
import { updateProfile as updateProfileApi } from '../services/auth.js';
import { useNotifications } from '../store/notificationStore.js';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const auth = getAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setFormData(data || {});
        setLoading(false);
      } catch (err) {
        addNotification('Failed to load profile', 'error');
        setLoading(false);
      }
    };

    if (auth) {
      loadProfile();
    }
  }, []);

  const handleSave = async () => {
    try {
      await updateProfileApi({ name: formData.name, email: formData.email });
      setProfile(formData);
      setEditing(false);
      addNotification('Profile updated successfully', 'success');
      setAuth({ ...auth, user: { ...auth.user, ...formData } });
    } catch (err) {
      addNotification('Failed to update profile', 'error');
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
    addNotification('Logged out successfully', 'success');
  };

  if (loading) {
    return (
      <main className="page">
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your account information</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Avatar Section */}
          <motion.div
            className="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="card-body text-center">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-4xl font-bold mb-4">
                {(profile?.name || profile?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{profile?.name || 'User'}</h2>
              <p className="text-gray-600">{profile?.role?.replace('_', ' ').charAt(0).toUpperCase() + profile?.role?.slice(1).replace('_', ' ')}</p>
            </div>
          </motion.div>

          {/* Profile Details Section */}
          <motion.div
            className="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <FiEdit2 /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <FiSave /> Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData(profile);
                      }}
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FiUser /> Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      className="input"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile?.name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FiMail /> Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      className="input"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile?.email}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FiMapPin /> Location
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      className="input"
                      placeholder="Add your location"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile?.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            className="card border-red-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card-body">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 inline-flex items-center justify-center gap-2 font-medium"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
