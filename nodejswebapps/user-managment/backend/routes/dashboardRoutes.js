const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { parseBrunoCollections } = require('../utils/brunoParser');
const logger = require('../config/logger');


router.get('/', authenticate, (req, res) => {
  const apiCalls = parseBrunoCollections();
  const baseUrl = req.protocol + '://' + req.get('host'); // e.g., http://localhost:3000

  // Group by category
  const categorized = {};
  apiCalls.forEach(api => {
    if (!categorized[api.category]) {
      categorized[api.category] = [];
    }
    categorized[api.category].push(api);
  });

  res.render('dashboard', {
    user: req.user,
    categorizedApiCalls: categorized,
    baseUrl
  });
});

module.exports = router;
