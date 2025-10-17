import { useState, useCallback } from 'react';

import { useState, useCallback } from 'react';

let notificationListeners = [];
let notifications = [];
let nextId = 0;

export function useNotifications() {
  const [notifs, setNotifs] = useState(notifications);

  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = nextId++;
    const notif = { id, message, type, timestamp: Date.now() };
    notifications = [notif, ...notifications];
    
    notificationListeners.forEach(listener => listener([...notifications]));
    setNotifs([...notifications]);

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    notifications = notifications.filter(n => n.id !== id);
    notificationListeners.forEach(listener => listener([...notifications]));
    setNotifs([...notifications]);
  }, []);

  return { notifications: notifs, addNotification, removeNotification };
}

export function subscribeToNotifications(callback) {
  notificationListeners.push(callback);
  return () => {
    notificationListeners = notificationListeners.filter(l => l !== callback);
  };
}
