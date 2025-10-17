const FALLBACK = [
  { id: 'rec-1', title: 'Rent a Tractor', score: 0.92 },
  { id: 'rec-2', title: 'Bulk Seeds Discount', score: 0.87 },
  { id: 'rec-3', title: 'Nearby Storage Options', score: 0.81 }
];

export async function getRecommendations(userId) {
  const url = import.meta.env.VITE_ML_API_URL || '';
  const endpoint = url ? `${url}/recommendations?user=${encodeURIComponent(userId)}` : `/ml/recommendations?user=${encodeURIComponent(userId)}`;
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('ML API error');
    const data = await res.json();
    return Array.isArray(data) ? data : FALLBACK;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('ML fetch failed:', err && err.message ? err.message : err);
    return FALLBACK;
  }
}
