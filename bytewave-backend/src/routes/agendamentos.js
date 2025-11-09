const express = require('express');
const { agendamentosController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', agendamentosController.getAgendamentos);
router.get('/sala/:salaId', agendamentosController.getAgendamentosPorSala);
router.get('/:id', agendamentosController.getAgendamentoById);
router.post('/', requireRole(['professor', 'admin']), agendamentosController.createAgendamento);
router.put('/:id', requireRole(['professor', 'admin']), agendamentosController.updateAgendamento);
router.patch('/:id/cancelar', requireRole(['professor', 'admin']), agendamentosController.cancelarAgendamento);

module.exports = router;