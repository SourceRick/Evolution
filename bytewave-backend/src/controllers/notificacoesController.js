const { Notificacao, User } = require('../models');
const { Op } = require('sequelize');

const notificacoesController = {
  async getNotificacoes(req, res) {
    try {
      const { page = 1, limit = 20, lida, tipo, prioridade } = req.query;
      const offset = (page - 1) * limit;

      const where = { id_usuario: req.userId };
      if (lida !== undefined) where.lida = lida === 'true';
      if (tipo) where.tipo = tipo;
      if (prioridade) where.prioridade = prioridade;

      const notificacoes = await Notificacao.findAndCountAll({
        where,
        order: [['criada_em', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        notificacoes: notificacoes.rows,
        total: notificacoes.count,
        page: parseInt(page),
        totalPages: Math.ceil(notificacoes.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar notificações' });
    }
  },

  async getNotificacaoById(req, res) {
    try {
      const { id } = req.params;

      const notificacao = await Notificacao.findByPk(id);
      
      if (!notificacao) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }

      // Verificar se a notificação pertence ao usuário
      if (notificacao.id_usuario !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para acessar esta notificação' });
      }

      // Marcar como lida ao visualizar
      if (!notificacao.lida) {
        await notificacao.update({ lida: true });
      }

      res.json(notificacao);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar notificação' });
    }
  },

  async marcarComoLida(req, res) {
    try {
      const { id } = req.params;

      const notificacao = await Notificacao.findByPk(id);
      
      if (!notificacao) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }

      if (notificacao.id_usuario !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para marcar esta notificação' });
      }

      await notificacao.update({ lida: true });

      res.json({ message: 'Notificação marcada como lida' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao marcar notificação como lida' });
    }
  },

  async marcarTodasComoLidas(req, res) {
    try {
      await Notificacao.update(
        { lida: true },
        { 
          where: { 
            id_usuario: req.userId,
            lida: false
          } 
        }
      );

      res.json({ message: 'Todas as notificações foram marcadas como lidas' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao marcar notificações como lidas' });
    }
  },

  async getEstatisticasNotificacoes(req, res) {
    try {
      const total = await Notificacao.count({
        where: { id_usuario: req.userId }
      });

      const naoLidas = await Notificacao.count({
        where: { 
          id_usuario: req.userId,
          lida: false
        }
      });

      const porTipo = await Notificacao.findAll({
        where: { id_usuario: req.userId },
        attributes: [
          'tipo',
          [sequelize.fn('COUNT', sequelize.col('id_notificacao')), 'quantidade']
        ],
        group: ['tipo']
      });

      const porPrioridade = await Notificacao.findAll({
        where: { id_usuario: req.userId },
        attributes: [
          'prioridade',
          [sequelize.fn('COUNT', sequelize.col('id_notificacao')), 'quantidade']
        ],
        group: ['prioridade']
      });

      res.json({
        total,
        naoLidas,
        porTipo,
        porPrioridade
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar estatísticas de notificações' });
    }
  },

  async criarNotificacao(req, res) {
    try {
      const {
        id_usuario,
        tipo,
        titulo,
        mensagem,
        link,
        prioridade
      } = req.body;

      // Apenas admin pode criar notificações para outros usuários
      if (id_usuario !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para criar notificações para outros usuários' });
      }

      const notificacao = await Notificacao.create({
        id_usuario: id_usuario || req.userId,
        tipo: tipo || 'Sistema',
        titulo,
        mensagem,
        link: link || null,
        prioridade: prioridade || 'media'
      });

      res.status(201).json({
        message: 'Notificação criada com sucesso',
        notificacao
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar notificação' });
    }
  },

  async deletarNotificacao(req, res) {
    try {
      const { id } = req.params;

      const notificacao = await Notificacao.findByPk(id);
      
      if (!notificacao) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
      }

      if (notificacao.id_usuario !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para deletar esta notificação' });
      }

      await notificacao.destroy();

      res.json({ message: 'Notificação deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar notificação' });
    }
  }
};

module.exports = notificacoesController;