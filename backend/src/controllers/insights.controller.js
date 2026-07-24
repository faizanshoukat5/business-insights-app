const Insight = require('../models/Insight');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * GET /insights
 */
const getInsights = async (req, res, next) => {
  try {
    const insights = await Insight.findOne();
    if (!insights) {
      return sendError(res, 404, 'Insights not found');
    }
    return sendSuccess(res, 200, 'Insights fetched successfully', insights.toJSON());
  } catch (error) {
    return next(error);
  }
};

module.exports = { getInsights };
