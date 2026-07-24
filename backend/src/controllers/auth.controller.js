const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * POST /login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password || String(email).trim() === '' || String(password).trim() === '') {
      return sendError(res, 400, 'Email and password are required');
    }

    // Normalize so "Admin@abcsalon.com " still matches the stored lowercase email.
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { login };
