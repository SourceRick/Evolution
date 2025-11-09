const express = require('express');
const { commentsController } = require('../controllers');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/post/:postId', commentsController.getCommentsByPost);
router.post('/post/:postId', commentsController.createComment);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);

module.exports = router;