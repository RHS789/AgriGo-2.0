import api from './api.js';

export async function listResources() {
  const { data } = await api.get('/resources');
  return data.data || data;
}

export async function getResource(id) {
  const { data } = await api.get(`/resources/${id}`);
  return data.data || data;
}

export async function createResource(payload) {
  const { data } = await api.post('/resources', payload);
  return data.data || data;
}

export async function updateResource(id, payload) {
  const { data } = await api.put(`/resources/${id}`, payload);
  return data.data || data;
}
