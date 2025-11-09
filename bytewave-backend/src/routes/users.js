const express = require('express');
const usersController = require('../controllers/usersController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// Apenas admin pode listar e gerenciar usuários
router.get('/', requireRole(['admin']), usersController.getAllUsers);
router.get('/:id', requireRole(['admin']), usersController.getUserById);
router.post('/', requireRole(['admin']), usersController.createUser);
router.put('/:id', requireRole(['admin']), usersController.updateUser);
router.delete('/:id', requireRole(['admin']), usersController.deleteUser);

// Rotas para perfil do próprio usuário
router.get('/profile/me', usersController.getUserById);
 

module.exports = router;
// maninho parece que esta faltando algo aqui
//Pode ser
//Mana 