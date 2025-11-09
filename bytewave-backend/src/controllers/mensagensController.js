const { Mensagem, User, Turma, Professor, Aluno } = require('../models');
const { Op } = require('sequelize');

const mensagensController = {
  async getMensagens(req, res) {
    try {
      const { page = 1, limit = 20, tipo, lida } = req.query;
      const offset = (page - 1) * limit;

      const where = {
        [Op.or]: [
          { id_remetente: req.userId },
          { id_destinatario: req.userId },
          { id_turma: { [Op.in]: await this.getTurmasUsuario(req.userId, req.userType) } }
        ]
      };

      if (tipo) where.tipo = tipo;
      if (lida !== undefined) where.lida = lida === 'true';

      const mensagens = await Mensagem.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'remetente',
            include: [
              { model: Professor, attributes: ['nome', 'foto_url'] },
              { model: Aluno, attributes: ['nome', 'foto_url'] }
            ]
          },
          {
            model: User,
            as: 'destinatario',
            include: [
              { model: Professor, attributes: ['nome', 'foto_url'] },
              { model: Aluno, attributes: ['nome', 'foto_url'] }
            ]
          },
          {
            model: Turma,
            attributes: ['id_turma', 'nome', 'codigo']
          }
        ],
        order: [['criada_em', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        mensagens: mensagens.rows,
        total: mensagens.count,
        page: parseInt(page),
        totalPages: Math.ceil(mensagens.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
  },

  async getMensagemById(req, res) {
    try {
      const { id } = req.params;

      const mensagem = await Mensagem.findByPk(id, {
        include: [
          {
            model: User,
            as: 'remetente',
            include: [
              { model: Professor, attributes: ['nome', 'foto_url', 'email'] },
              { model: Aluno, attributes: ['nome', 'foto_url', 'email'] }
            ]
          },
          {
            model: User,
            as: 'destinatario',
            include: [
              { model: Professor, attributes: ['nome', 'foto_url', 'email'] },
              { model: Aluno, attributes: ['nome', 'foto_url', 'email'] }
            ]
          },
          {
            model: Turma,
            attributes: ['id_turma', 'nome', 'codigo']
          }
        ]
      });

      if (!mensagem) {
        return res.status(404).json({ error: 'Mensagem não encontrada' });
      }

      // Verificar permissão
      if (!this.temPermissaoMensagem(mensagem, req.userId)) {
        return res.status(403).json({ error: 'Sem permissão para acessar esta mensagem' });
      }

      // Marcar como lida se for destinatário
      if (mensagem.id_destinatario === req.userId && !mensagem.lida) {
        await mensagem.update({ lida: true });
      }

      res.json(mensagem);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar mensagem' });
    }
  },

  async enviarMensagem(req, res) {
    try {
      const {
        id_destinatario,
        id_turma,
        assunto,
        conteudo,
        tipo
      } = req.body;

      if (!conteudo) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }

      // Validar destinatário ou turma
      if (!id_destinatario && !id_turma) {
        return res.status(400).json({ error: 'Destinatário ou turma é obrigatório' });
      }

      // Verificar permissões para envio para turma
      if (id_turma && req.userType !== 'professor' && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Apenas professores podem enviar mensagens para turmas' });
      }

      const mensagem = await Mensagem.create({
        id_remetente: req.userId,
        id_destinatario: id_destinatario || null,
        id_turma: id_turma || null,
        assunto,
        conteudo,
        tipo: tipo || (id_turma ? 'Turma' : 'Individual')
      });

      const mensagemCompleta = await Mensagem.findByPk(mensagem.id_mensagem, {
        include: [
          {
            model: User,
            as: 'remetente',
            include: [
              { model: Professor, attributes: ['nome', 'foto_url'] },
              { model: Aluno, attributes: ['nome', 'foto_url'] }
            ]
          }
        ]
      });

      res.status(201).json({
        message: 'Mensagem enviada com sucesso',
        mensagem: mensagemCompleta
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
  },

  async responderMensagem(req, res) {
    try {
      const { id } = req.params;
      const { conteudo } = req.body;

      const mensagemOriginal = await Mensagem.findByPk(id);
      if (!mensagemOriginal) {
        return res.status(404).json({ error: 'Mensagem original não encontrada' });
      }

      if (!this.temPermissaoMensagem(mensagemOriginal, req.userId)) {
        return res.status(403).json({ error: 'Sem permissão para responder esta mensagem' });
      }

      const resposta = await Mensagem.create({
        id_remetente: req.userId,
        id_destinatario: mensagemOriginal.id_remetente,
        assunto: `Re: ${mensagemOriginal.assunto}`,
        conteudo,
        tipo: 'Individual'
      });

      // Marcar original como respondida
      await mensagemOriginal.update({ respondida: true });

      res.status(201).json({
        message: 'Mensagem respondida com sucesso',
        resposta
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao responder mensagem' });
    }
  },

  async marcarComoLida(req, res) {
    try {
      const { id } = req.params;

      const mensagem = await Mensagem.findByPk(id);
      if (!mensagem) {
        return res.status(404).json({ error: 'Mensagem não encontrada' });
      }

      if (mensagem.id_destinatario !== req.userId) {
        return res.status(403).json({ error: 'Sem permissão para marcar esta mensagem' });
      }

      await mensagem.update({ lida: true });

      res.json({ message: 'Mensagem marcada como lida' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao marcar mensagem como lida' });
    }
  },

  async getConversa(req, res) {
    try {
      const { usuarioId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      const mensagens = await Mensagem.findAndCountAll({
        where: {
          tipo: 'Individual',
          [Op.or]: [
            {
              id_remetente: req.userId,
              id_destinatario: usuarioId
            },
            {
              id_remetente: usuarioId,
              id_destinatario: req.userId
            }
          ]
        },
        include: [
          {
            model: User,
            as: 'remetente',
            include: [
              { model: Professor, attributes: ['nome', 'foto_url'] },
              { model: Aluno, attributes: ['nome', 'foto_url'] }
            ]
          }
        ],
        order: [['criada_em', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        mensagens: mensagens.rows,
        total: mensagens.count,
        page: parseInt(page),
        totalPages: Math.ceil(mensagens.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar conversa' });
    }
  },

  // Métodos auxiliares
  async getTurmasUsuario(userId, userType) {
    if (userType === 'aluno') {
      const matriculas = await Matricula.findAll({
        where: { id_aluno: userId, status: 'Ativa' },
        attributes: ['id_turma']
      });
      return matriculas.map(m => m.id_turma);
    } else if (userType === 'professor') {
      const turmas = await Turma.findAll({
        where: { id_professor_coordenador: userId, ativo: true },
        attributes: ['id_turma']
      });
      return turmas.map(t => t.id_turma);
    }
    return [];
  },

  temPermissaoMensagem(mensagem, userId) {
    return mensagem.id_remetente === userId || 
           mensagem.id_destinatario === userId ||
           (mensagem.id_turma && this.getTurmasUsuario(userId).includes(mensagem.id_turma));
  }
};

module.exports = mensagensController;