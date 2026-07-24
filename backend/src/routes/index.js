const express = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const businessRoutes = require('./business.routes');
const insightsRoutes = require('./insights.routes');
const reviewsRoutes = require('./reviews.routes');

const router = express.Router();

// All resources mounted at root so final paths are exactly:
// /health /login /business /insights /reviews
router.use(healthRoutes);
router.use(authRoutes);
router.use(businessRoutes);
router.use(insightsRoutes);
router.use(reviewsRoutes);

module.exports = router;
