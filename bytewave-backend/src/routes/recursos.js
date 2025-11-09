const express = require('express');
const { recursosController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', recursosController.getRecursos);
router.get('/disponiveis', recursosController.getRecursosDisponiveis);
router.get('/:id', recursosController.getRecursoById);
router.get('/:id/historico', recursosController.getHistoricoRecurso);

// Apenas admin pode gerenciar recursos
router.post('/', requireRole(['admin']), recursosController.createRecurso);
router.put('/:id', requireRole(['admin']), recursosController.updateRecurso);

module.exports = router;