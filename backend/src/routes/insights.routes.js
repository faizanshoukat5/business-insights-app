const express = require('express');
const auth = require('../middleware/auth');
const { getInsights } = require('../controllers/insights.controller');

const router = express.Router();

router.get('/insights', auth, getInsights);

module.exports = router;
