const FALLBACK = [
  { id: 'rec-1', title: 'Rent a Tractor', score: 0.92 },
  { id: 'rec-2', title: 'Bulk Seeds Discount', score: 0.87 },
  { id: 'rec-3', title: 'Nearby Storage Options', score: 0.81 }
];

export async function getRecommendations(userId) {
  const url = import.meta.env.VITE_ML_API_URL;
  if (!url) return FALLBACK;
  try {
    const res = await fetch(`${url}/recommendations?user=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('ML API error');
    const data = await res.json();
    return Array.isArray(data) ? data : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
