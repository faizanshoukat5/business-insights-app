const express = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const businessRoutes = require('./business.routes');
const insightsRoutes = require('./insights.routes');
const reviewsRoutes = require('./reviews.routes');

const router = express.Router();

const { sendSuccess } = require('../utils/apiResponse');

// Friendly index for anyone visiting the bare base URL in a browser.
router.get('/', (req, res) =>
  sendSuccess(res, 200, 'Business Insights API', {
    endpoints: {
      'GET /health': 'Health check (public)',
      'POST /login': 'Login with email + password (public)',
      'GET /business': 'Business profile (Bearer JWT)',
      'GET /insights': 'Business insights (Bearer JWT)',
      'GET /reviews': 'Reviews list (Bearer JWT)',
    },
  })
);

// All resources mounted at root so final paths are exactly:
// /health /login /business /insights /reviews
router.use(healthRoutes);
router.use(authRoutes);
router.use(businessRoutes);
router.use(insightsRoutes);
router.use(reviewsRoutes);

module.exports = router;
