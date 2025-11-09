const express = require('express');
const { turmasController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', turmasController.getAllTurmas);
router.get('/:id', turmasController.getTurmaById);
router.get('/:id/alunos', turmasController.getTurmaAlunos);
router.get('/:id/statistics', turmasController.getTurmaStatistics);

// Apenas professores e admin podem gerenciar turmas
router.post('/', requireRole(['admin', 'professor']), turmasController.createTurma);
router.put('/:id', requireRole(['admin', 'professor']), turmasController.updateTurma);

module.exports = router;