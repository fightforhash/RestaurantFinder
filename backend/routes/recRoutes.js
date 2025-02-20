const express = require('express');
const { handleRecommendation } = require('../controllers/recController');
const router = express.Router();

router.post('/', 
  // Add validation middleware here
  handleRecommendation
);

module.exports = router;