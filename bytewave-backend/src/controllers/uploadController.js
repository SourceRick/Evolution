const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ArquivoTrabalho, PostArquivo } = require('../models');

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

const uploadController = {
  // Middleware de upload
  uploadMiddleware: upload,

  async uploadArquivoTrabalho(req, res) {
    try {
      const { id_trabalho } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      if (!id_trabalho) {
        // Limpar arquivo se não houver id_trabalho
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'ID do trabalho é obrigatório' });
      }

      const arquivo = await ArquivoTrabalho.create({
        id_trabalho,
        nome_original: req.file.originalname,
        nome_arquivo: req.file.filename,
        caminho: req.file.path,
        tipo_arquivo: path.extname(req.file.originalname).substring(1),
        tamanho_bytes: req.file.size,
        mimetype: req.file.mimetype
      });

      res.status(201).json({
        message: 'Arquivo enviado com sucesso',
        arquivo
      });
    } catch (error) {
      // Limpar arquivo em caso de erro
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
    }
  },

  async uploadArquivoPost(req, res) {
    try {
      const { id_post } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      if (!id_post) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'ID do post é obrigatório' });
      }

      const arquivo = await PostArquivo.create({
        id_post,
        nome_original: req.file.originalname,
        nome_arquivo: req.file.filename,
        caminho: req.file.path,
        tipo_arquivo: path.extname(req.file.originalname).substring(1),
        tamanho_bytes: req.file.size,
        mimetype: req.file.mimetype
      });

      res.status(201).json({
        message: 'Arquivo enviado com sucesso',
        arquivo
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
    }
  },

  async downloadArquivo(req, res) {
    try {
      const { id, tipo } = req.params;

      let arquivo;
      if (tipo === 'trabalho') {
        arquivo = await ArquivoTrabalho.findByPk(id);
      } else if (tipo === 'post') {
        arquivo = await PostArquivo.findByPk(id);
      } else {
        return res.status(400).json({ error: 'Tipo de arquivo inválido' });
      }

      if (!arquivo) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      if (!fs.existsSync(arquivo.caminho)) {
        return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
      }

      // Configurar headers para download
      res.setHeader('Content-Type', arquivo.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename="${arquivo.nome_original}"`);
      res.setHeader('Content-Length', arquivo.tamanho_bytes);

      // Enviar arquivo
      const fileStream = fs.createReadStream(arquivo.caminho);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer download do arquivo' });
    }
  },

  async visualizarArquivo(req, res) {
    try {
      const { id, tipo } = req.params;

      let arquivo;
      if (tipo === 'trabalho') {
        arquivo = await ArquivoTrabalho.findByPk(id);
      } else if (tipo === 'post') {
        arquivo = await PostArquivo.findByPk(id);
      } else {
        return res.status(400).json({ error: 'Tipo de arquivo inválido' });
      }

      if (!arquivo) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      if (!fs.existsSync(arquivo.caminho)) {
        return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
      }

      // Tipos de arquivo que podem ser visualizados no navegador
      const visualizaveis = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt'];
      const extensao = path.extname(arquivo.caminho).substring(1).toLowerCase();

      if (!visualizaveis.includes(extensao)) {
        return res.status(400).json({ error: 'Este tipo de arquivo não pode ser visualizado' });
      }

      res.setHeader('Content-Type', arquivo.mimetype);
      res.setHeader('Content-Disposition', `inline; filename="${arquivo.nome_original}"`);

      const fileStream = fs.createReadStream(arquivo.caminho);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao visualizar arquivo' });
    }
  },

  async deletarArquivo(req, res) {
    try {
      const { id, tipo } = req.params;

      let arquivo;
      if (tipo === 'trabalho') {
        arquivo = await ArquivoTrabalho.findByPk(id);
      } else if (tipo === 'post') {
        arquivo = await PostArquivo.findByPk(id);
      } else {
        return res.status(400).json({ error: 'Tipo de arquivo inválido' });
      }

      if (!arquivo) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      // Verificar permissão (simplificado - você pode adicionar lógica mais complexa)
      const temPermissao = await this.verificarPermissaoArquivo(arquivo, req.userId, req.userType);
      if (!temPermissao) {
        return res.status(403).json({ error: 'Sem permissão para deletar este arquivo' });
      }

      // Deletar arquivo físico
      if (fs.existsSync(arquivo.caminho)) {
        fs.unlinkSync(arquivo.caminho);
      }

      // Deletar registro no banco
      await arquivo.destroy();

      res.json({ message: 'Arquivo deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar arquivo' });
    }
  },

  async verificarPermissaoArquivo(arquivo, userId, userType) {
    // Lógica de verificação de permissão
    // Você pode implementar verificação mais complexa baseada no tipo de arquivo
    if (userType === 'admin') return true;
    
    // Para arquivos de trabalho, verificar se o usuário é o aluno dono
    if (arquivo.Trabalho && arquivo.Trabalho.id_aluno === userId) return true;
    
    // Para arquivos de post, verificar se o usuário é o autor
    if (arquivo.Post && arquivo.Post.id_autor === userId) return true;

    return false;
  },

  async getArquivosPorTrabalho(req, res) {
    try {
      const { trabalhoId } = req.params;

      const arquivos = await ArquivoTrabalho.findAll({
        where: { id_trabalho: trabalhoId },
        order: [['ordem', 'ASC'], ['enviado_em', 'ASC']]
      });

      res.json(arquivos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar arquivos do trabalho' });
    }
  },

  async getArquivosPorPost(req, res) {
    try {
      const { postId } = req.params;

      const arquivos = await PostArquivo.findAll({
        where: { id_post: postId },
        order: [['ordem', 'ASC'], ['enviado_em', 'ASC']]
      });

      res.json(arquivos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar arquivos do post' });
    }
  }
};

module.exports = uploadController;