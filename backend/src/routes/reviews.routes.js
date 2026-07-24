const express = require('express');
const auth = require('../middleware/auth');
const { getReviews } = require('../controllers/reviews.controller');

const router = express.Router();

router.get('/reviews', auth, getReviews);

module.exports = router;
