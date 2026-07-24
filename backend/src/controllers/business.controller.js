const Business = require('../models/Business');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * GET /business
 */
const getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne();
    if (!business) {
      return sendError(res, 404, 'Business not found');
    }
    return sendSuccess(res, 200, 'Business profile fetched successfully', business.toJSON());
  } catch (error) {
    return next(error);
  }
};

module.exports = { getBusiness };
