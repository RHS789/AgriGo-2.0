import api from './api.js';

export async function sendMessage({ booking_id, message }) {
  const { data } = await api.post('/chats', { booking_id, message });
  return data.data || data;
}

export async function getMessages(booking_id) {
  const { data } = await api.get(`/chats/${booking_id}`);
  return data.data || data;
}

export async function markAsRead(booking_id) {
  const { data } = await api.put(`/chats/${booking_id}/read`);
  return data.data || data;
}
