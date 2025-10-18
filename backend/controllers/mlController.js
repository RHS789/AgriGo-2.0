const supabase = require('../config/supabase');
const User = require('../models/User');

// Simple rule-based recommendations
async function getRecommendations(req, res) {
  try {
    const userId = req.query.user || null;

    // Default fallback recommendations
    const FALLBACK = [
      { id: 'rec-1', title: 'Rent a Tractor', score: 0.8 },
      { id: 'rec-2', title: 'Bulk Seeds Discount', score: 0.75 },
      { id: 'rec-3', title: 'Nearby Storage Options', score: 0.7 }
    ];

    if (!userId) return res.json(FALLBACK);

    // Try to get user profile
    let user = null;
    try {
      user = await User.getProfile(userId);
    } catch (err) {
      // ignore, use fallback
    }

    // If no user or no role, return generic recommendations
    if (!user || !user.role) return res.json(FALLBACK);

    if (user.role === 'farmer') {
      // For farmers: recommend available resources (highest price maybe treated as quality) near them
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('availability', 'available')
        .order('price', { ascending: false })
        .limit(6);

      if (error) return res.json(FALLBACK);

      const recs = data.map((r, i) => ({ id: r.id || `r-${i}`, title: r.name || r.type || 'Resource', score: Math.max(0.5, 1 - i * 0.1) }));
      return res.json(recs.length ? recs : FALLBACK);
    }

    if (user.role === 'resource_provider') {
      // For providers: recommend actions to increase bookings or promote items
      const recs = [
        { id: 'p-1', title: 'Promote Your Resources', score: 0.9 },
        { id: 'p-2', title: 'Enable Instant Booking', score: 0.8 },
        { id: 'p-3', title: 'Offer Seasonal Discounts', score: 0.7 }
      ];
      return res.json(recs);
    }

    return res.json(FALLBACK);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('ML recommendations error:', error && error.message ? error.message : error);
    return res.status(500).json({ success: false, message: 'Failed to generate recommendations' });
  }
}

module.exports = { getRecommendations };
