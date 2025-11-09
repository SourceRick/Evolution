const express = require('express');
const { searchController } = require('../controllers');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/global', searchController.searchGlobal);
router.get('/avancada', searchController.searchAdvanced);
router.get('/sugestoes', searchController.getSearchSuggestions);

module.exports = router;