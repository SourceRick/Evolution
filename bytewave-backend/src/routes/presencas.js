const express = require('express');
const { presencasController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', presencasController.getPresencas);
router.get('/aluno/:alunoId', presencasController.getPresencaAluno);
router.get('/justificativas/pendentes', requireRole(['professor', 'admin']), presencasController.getJustificativasPendentes);

router.post('/:id/justificar', presencasController.justificarFalta);
router.patch('/justificativa/:id/avaliar', requireRole(['professor', 'admin']), presencasController.avaliarJustificativa);

module.exports = router;