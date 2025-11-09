const express = require('express');
const { relatoriosController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/alunos', requireRole(['professor', 'admin']), relatoriosController.getRelatorioAlunos);
router.get('/notas', requireRole(['professor', 'admin']), relatoriosController.getRelatorioNotas);
router.get('/presencas', requireRole(['professor', 'admin']), relatoriosController.getRelatorioPresencas);
router.get('/atividades', requireRole(['professor', 'admin']), relatoriosController.getRelatorioAtividades);
router.get('/financeiro', requireRole(['admin']), relatoriosController.getRelatorioFinanceiro);

module.exports = router;