const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// A valid bcrypt hash of a random string that matches no real user. When the
// email is unknown we still run bcrypt.compare against this so the not-found
// branch takes comparable time to the wrong-password branch, avoiding a
// user-enumeration timing side-channel.
const DUMMY_PASSWORD_HASH = '$2a$10$0K5DWj4uOgfESjy.lzWpHOUMe7p20./HyxO4rUAuuvAdpzP6Zf/Pa';

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
      // Compare against a dummy hash so this branch takes comparable time to
      // the wrong-password branch (mitigates user-enumeration via timing).
      await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
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
