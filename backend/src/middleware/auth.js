const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/apiResponse');

const UNAUTHORIZED_MESSAGE = 'Unauthorized: token missing or invalid';

/**
 * Verifies the Bearer JWT from the Authorization header.
 * Attaches the decoded payload as req.user on success.
 * Responds with the 401 envelope on ANY failure.
 */
const auth = (req, res, next) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return sendError(res, 401, UNAUTHORIZED_MESSAGE);
  }

  const token = header.slice(7).trim();
  if (!token) {
    return sendError(res, 401, UNAUTHORIZED_MESSAGE);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded;
    return next();
  } catch (error) {
    return sendError(res, 401, UNAUTHORIZED_MESSAGE);
  }
};

module.exports = auth;
