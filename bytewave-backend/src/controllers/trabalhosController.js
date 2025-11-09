const { Trabalho, Atividade, Aluno, ArquivoTrabalho, User, Professor } = require('../models');
const { Op } = require('sequelize');

const trabalhosController = {
  async getTrabalhos(req, res) {
    try {
      const { page = 1, limit = 20, atividade, aluno, status } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (atividade) where.id_atividade = atividade;
      if (aluno) where.id_aluno = aluno;
      if (status) where.status = status;

      const trabalhos = await Trabalho.findAndCountAll({
        where,
        include: [
          {
            model: Atividade,
            attributes: ['id_atividade', 'titulo', 'valor_maximo', 'data_entrega']
          },
          {
            model: Aluno,
            attributes: ['id_aluno', 'nome', 'foto_url', 'email']
          },
          {
            model: ArquivoTrabalho,
            required: false
          }
        ],
        order: [['data_entrega', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        trabalhos: trabalhos.rows,
        total: trabalhos.count,
        page: parseInt(page),
        totalPages: Math.ceil(trabalhos.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar trabalhos' });
    }
  },

  async getTrabalhoById(req, res) {
    try {
      const { id } = req.params;

      const trabalho = await Trabalho.findByPk(id, {
        include: [
          {
            model: Atividade,
            include: [{
              model: Professor,
              attributes: ['nome', 'foto_url', 'especialidade']
            }]
          },
          {
            model: Aluno,
            attributes: ['id_aluno', 'nome', 'foto_url', 'email']
          },
          {
            model: ArquivoTrabalho
          }
        ]
      });

      if (!trabalho) {
        return res.status(404).json({ error: 'Trabalho não encontrado' });
      }

      res.json(trabalho);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar trabalho' });
    }
  },

  async createTrabalho(req, res) {
    try {
      const { id_atividade, titulo, conteudo, status } = req.body;

      // Verificar se atividade existe e está ativa
      const atividade = await Atividade.findByPk(id_atividade);
      if (!atividade || !atividade.ativa) {
        return res.status(404).json({ error: 'Atividade não encontrada ou inativa' });
      }

      // Verificar se já existe trabalho do aluno para esta atividade
      const trabalhoExistente = await Trabalho.findOne({
        where: {
          id_atividade,
          id_aluno: req.userId
        }
      });

      let trabalho;
      if (trabalhoExistente) {
        // Atualizar trabalho existente
        trabalho = await trabalhoExistente.update({
          titulo,
          conteudo,
          status: status || 'Rascunho',
          versao: trabalhoExistente.versao + 1,
          data_entrega: status === 'Entregue' ? new Date() : trabalhoExistente.data_entrega
        });
      } else {
        // Criar novo trabalho
        trabalho = await Trabalho.create({
          id_atividade,
          id_aluno: req.userId,
          titulo,
          conteudo,
          status: status || 'Rascunho',
          data_entrega: status === 'Entregue' ? new Date() : null
        });
      }

      res.status(201).json({
        message: status === 'Entregue' ? 'Trabalho entregue com sucesso' : 'Trabalho salvo como rascunho',
        trabalho
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar trabalho' });
    }
  },

  async updateTrabalho(req, res) {
    try {
      const { id } = req.params;
      const { titulo, conteudo, status } = req.body;

      const trabalho = await Trabalho.findByPk(id);
      if (!trabalho) {
        return res.status(404).json({ error: 'Trabalho não encontrado' });
      }

      // Verificar se o aluno é o dono do trabalho
      if (trabalho.id_aluno !== req.userId && req.userType !== 'professor') {
        return res.status(403).json({ error: 'Sem permissão para editar este trabalho' });
      }

      await trabalho.update({
        titulo,
        conteudo,
        status,
        data_entrega: status === 'Entregue' ? new Date() : trabalho.data_entrega,
        versao: trabalho.versao + 1
      });

      res.json({ message: 'Trabalho atualizado com sucesso', trabalho });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar trabalho' });
    }
  },

  async avaliarTrabalho(req, res) {
    try {
      const { id } = req.params;
      const { nota, comentario_professor, status } = req.body;

      const trabalho = await Trabalho.findByPk(id);
      if (!trabalho) {
        return res.status(404).json({ error: 'Trabalho não encontrado' });
      }

      // Apenas professores podem avaliar
      if (req.userType !== 'professor') {
        return res.status(403).json({ error: 'Apenas professores podem avaliar trabalhos' });
      }

      await trabalho.update({
        nota,
        comentario_professor,
        status: status || 'Avaliado',
        data_avaliacao: new Date()
      });

      res.json({ message: 'Trabalho avaliado com sucesso', trabalho });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao avaliar trabalho' });
    }
  },

  async getTrabalhosByAluno(req, res) {
    try {
      const { alunoId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const trabalhos = await Trabalho.findAndCountAll({
        where: { id_aluno: alunoId },
        include: [
          {
            model: Atividade,
            include: [{
              model: Professor,
              attributes: ['nome', 'foto_url']
            }]
          }
        ],
        order: [['data_entrega', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        trabalhos: trabalhos.rows,
        total: trabalhos.count,
        page: parseInt(page),
        totalPages: Math.ceil(trabalhos.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar trabalhos do aluno' });
    }
  }
};

module.exports = trabalhosController;