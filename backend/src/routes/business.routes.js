const express = require('express');
const auth = require('../middleware/auth');
const { getBusiness } = require('../controllers/business.controller');

const router = express.Router();

router.get('/business', auth, getBusiness);

module.exports = router;
