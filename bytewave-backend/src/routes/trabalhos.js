const express = require('express');
const { trabalhosController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', trabalhosController.getTrabalhos);
router.get('/aluno/:alunoId', trabalhosController.getTrabalhosByAluno);
router.get('/:id', trabalhosController.getTrabalhoById);
router.post('/', trabalhosController.createTrabalho);
router.put('/:id', trabalhosController.updateTrabalho);

// Apenas professores podem avaliar trabalhos
router.patch('/:id/avaliar', requireRole(['professor', 'admin']), trabalhosController.avaliarTrabalho);

module.exports = router;