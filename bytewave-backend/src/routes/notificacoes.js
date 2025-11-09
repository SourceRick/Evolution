const express = require('express');
const { notificacoesController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', notificacoesController.getNotificacoes);
router.get('/estatisticas', notificacoesController.getEstatisticasNotificacoes);
router.get('/:id', notificacoesController.getNotificacaoById);
router.post('/', notificacoesController.criarNotificacao);
router.patch('/:id/lida', notificacoesController.marcarComoLida);
router.patch('/marcar-todas-lidas', notificacoesController.marcarTodasComoLidas);
router.delete('/:id', notificacoesController.deletarNotificacao);

module.exports = router;