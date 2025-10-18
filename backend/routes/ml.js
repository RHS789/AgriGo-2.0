const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/mlController');

// GET /ml/recommendations?user=<userId>
router.get('/recommendations', getRecommendations);

module.exports = router;
