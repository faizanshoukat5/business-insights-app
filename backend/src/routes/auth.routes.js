const express = require('express');
const rateLimit = require('express-rate-limit');
const { login } = require('../controllers/auth.controller');
const { sendError } = require('../utils/apiResponse');

const router = express.Router();

// Basic brute-force protection on login. Bypassed under Jest (NODE_ENV==='test')
// so the suite's many login calls stay deterministic.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? Infinity : 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    sendError(res, 429, 'Too many login attempts, please try again later'),
});

router.post('/login', loginLimiter, login);

module.exports = router;
