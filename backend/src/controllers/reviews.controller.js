const Review = require('../models/Review');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /reviews  (sorted by date, newest first)
 */
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    return sendSuccess(
      res,
      200,
      'Reviews fetched successfully',
      reviews.map((review) => review.toJSON())
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = { getReviews };
