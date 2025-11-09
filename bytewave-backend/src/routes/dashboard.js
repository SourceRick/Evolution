const express = require('express');
const { dashboardController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/aluno', dashboardController.getDashboardAluno);
router.get('/professor', requireRole(['professor', 'admin']), dashboardController.getDashboardProfessor);
router.get('/admin', requireRole(['admin']), dashboardController.getDashboardAdmin);

module.exports = router;