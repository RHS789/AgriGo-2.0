import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../store/notificationStore.js';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export default function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle className="text-green-600 text-lg" />;
      case 'error': return <FiAlertCircle className="text-red-600 text-lg" />;
      default: return <FiInfo className="text-blue-600 text-lg" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 rounded-lg border p-4 ${getColors(notif.type)} shadow-lg`}
          >
            <div className="mt-0.5">{getIcon(notif.type)}</div>
            <div className="flex-1 text-sm">{notif.message}</div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-lg opacity-70 hover:opacity-100"
            >
              <FiX />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
