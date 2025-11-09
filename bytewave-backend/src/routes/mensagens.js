const express = require('express');
const { mensagensController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', mensagensController.getMensagens);
router.get('/conversa/:usuarioId', mensagensController.getConversa);
router.get('/:id', mensagensController.getMensagemById);
router.post('/', mensagensController.enviarMensagem);
router.post('/:id/responder', mensagensController.responderMensagem);
router.patch('/:id/lida', mensagensController.marcarComoLida);

module.exports = router;