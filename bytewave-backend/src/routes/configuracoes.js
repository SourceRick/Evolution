const express = require('express');
const { configuracoesController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Configurações do sistema (apenas admin)
router.get('/sistema', requireRole(['admin']), configuracoesController.getConfiguracoes);
router.get('/sistema/:chave', requireRole(['admin']), configuracoesController.getConfiguracaoByChave);
router.put('/sistema/:chave', requireRole(['admin']), configuracoesController.updateConfiguracao);
router.get('/sistema/estatisticas', requireRole(['admin']), configuracoesController.getEstatisticasSistema);

// Atalhos de acessibilidade (todos os usuários)
router.get('/atalhos', configuracoesController.getAtalhosAcessibilidade);
router.patch('/atalhos/:id', configuracoesController.updateAtalhoAcessibilidade);

// FAQs (todos os usuários)
router.get('/faqs', configuracoesController.getFaqs);
router.get('/faqs/:id', configuracoesController.getFaqById);
router.post('/faqs', requireRole(['admin']), configuracoesController.createFaq);
router.put('/faqs/:id', requireRole(['admin']), configuracoesController.updateFaq);
router.patch('/faqs/:id/avaliar', configuracoesController.avaliarFaq);

module.exports = router;