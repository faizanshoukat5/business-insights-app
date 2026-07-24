/**
 * Centralized response helpers so the response envelope
 * { success, message, data } is structurally impossible to get wrong.
 */

const sendSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data === undefined ? null : data,
  });
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

module.exports = { sendSuccess, sendError };
