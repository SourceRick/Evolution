const express = require('express');
const { uploadController } = require('../controllers');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Upload de arquivos
router.post('/trabalho', 
  uploadController.uploadMiddleware.single('arquivo'),
  uploadController.uploadArquivoTrabalho
);

router.post('/post',
  uploadController.uploadMiddleware.single('arquivo'),
  uploadController.uploadArquivoPost
);

// Download e visualização
router.get('/download/:tipo/:id', uploadController.downloadArquivo);
router.get('/visualizar/:tipo/:id', uploadController.visualizarArquivo);

// Gerenciamento de arquivos
router.get('/trabalho/:trabalhoId', uploadController.getArquivosPorTrabalho);
router.get('/post/:postId', uploadController.getArquivosPorPost);
router.delete('/:tipo/:id', uploadController.deletarArquivo);

module.exports = router;