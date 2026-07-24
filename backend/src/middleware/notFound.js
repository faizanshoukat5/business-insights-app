const { sendError } = require('../utils/apiResponse');

const notFound = (req, res) => {
  return sendError(res, 404, 'Route not found');
};

module.exports = notFound;
