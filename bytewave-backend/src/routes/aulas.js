const express = require('express');
const { aulasController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', aulasController.getAulas);
router.get('/turma/:turmaId', aulasController.getAulasByTurma);
router.get('/:id', aulasController.getAulaById);
router.post('/', requireRole(['professor', 'admin']), aulasController.createAula);
router.put('/:id', requireRole(['professor', 'admin']), aulasController.updateAula);
router.post('/:id/presenca', requireRole(['professor', 'admin']), aulasController.registrarPresenca);

module.exports = router;