import api from './api.js';

export async function listBookings() {
  const { data } = await api.get('/bookings');
  return data.data || data;
}

export async function getBooking(id) {
  const { data } = await api.get(`/bookings/${id}`);
  return data.data || data;
}

export async function createBooking(payload) {
  const { data } = await api.post('/bookings', payload);
  return data.data || data;
}

export async function updateBookingStatus(id, status) {
  const { data } = await api.put(`/bookings/${id}/status`, { status });
  return data.data || data;
}
