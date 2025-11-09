const express = require('express');
const { postsController } = require('../controllers');
const { authMiddleware, auditMiddleware } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// Feed e posts
router.get('/feed', postsController.getFeed);
router.get('/:id', postsController.getPostById);
router.post('/', auditMiddleware('posts'), postsController.createPost);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);
router.patch('/:id/fixar', postsController.toggleFixarPost);

module.exports = router;