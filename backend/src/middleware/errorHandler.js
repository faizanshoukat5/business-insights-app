const { sendError } = require('../utils/apiResponse');

// Centralized error handler: every error still returns the standard envelope.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  // Mongoose validation / cast errors -> 400
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return sendError(res, 400, err.message || 'Invalid request');
  }

  // JWT errors -> 401
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'NotBeforeError') {
    return sendError(res, 401, 'Unauthorized: token missing or invalid');
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';
  return sendError(res, statusCode, message);
};

module.exports = errorHandler;
