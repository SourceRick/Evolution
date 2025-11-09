const express = require('express');
const { reactionsController } = require('../controllers');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', reactionsController.addReaction);
router.get('/post/:postId', reactionsController.getPostReactions);
router.delete('/:id', reactionsController.removeReaction);

module.exports = router;