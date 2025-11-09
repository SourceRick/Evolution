const { Recurso, AgendamentoRecurso, Agendamento } = require('../models');
const { Op } = require('sequelize');

const recursosController = {
  async getRecursos(req, res) {
    try {
      const { page = 1, limit = 20, tipo, ativo, disponivel } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (tipo) where.tipo = tipo;
      if (ativo !== undefined) where.ativo = ativo === 'true';
      
      if (disponivel === 'true') {
        where.quantidade_disponivel = { [Op.gt]: 0 };
      }

      const recursos = await Recurso.findAndCountAll({
        where,
        order: [['nome', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        recursos: recursos.rows,
        total: recursos.count,
        page: parseInt(page),
        totalPages: Math.ceil(recursos.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar recursos' });
    }
  },

  async getRecursoById(req, res) {
    try {
      const { id } = req.params;

      const recurso = await Recurso.findByPk(id, {
        include: [{
          model: AgendamentoRecurso,
          include: [{
            model: Agendamento,
            where: { 
              status: { [Op.in]: ['Agendado', 'Confirmado'] },
              data_agendamento: { [Op.gte]: new Date() }
            },
            required: false
          }]
        }]
      });

      if (!recurso) {
        return res.status(404).json({ error: 'Recurso não encontrado' });
      }

      res.json(recurso);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar recurso' });
    }
  },

  async createRecurso(req, res) {
    try {
      const {
        nome,
        tipo,
        descricao,
        quantidade_total,
        localizacao,
        especificacoes_tecnicas
      } = req.body;

      const recurso = await Recurso.create({
        nome,
        tipo: tipo || 'Equipamento',
        descricao,
        quantidade_total: quantidade_total || 1,
        quantidade_disponivel: quantidade_total || 1,
        localizacao,
        especificacoes_tecnicas: especificacoes_tecnicas ? JSON.parse(especificacoes_tecnicas) : null
      });

      res.status(201).json({
        message: 'Recurso criado com sucesso',
        recurso
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar recurso' });
    }
  },

  async updateRecurso(req, res) {
    try {
      const { id } = req.params;
      const {
        nome,
        descricao,
        quantidade_total,
        localizacao,
        especificacoes_tecnicas,
        ativo
      } = req.body;

      const recurso = await Recurso.findByPk(id);
      if (!recurso) {
        return res.status(404).json({ error: 'Recurso não encontrado' });
      }

      // Calcular nova quantidade disponível
      const diferenca = quantidade_total - recurso.quantidade_total;
      const novaQuantidadeDisponivel = recurso.quantidade_disponivel + diferenca;

      await recurso.update({
        nome,
        descricao,
        quantidade_total,
        quantidade_disponivel: novaQuantidadeDisponivel > 0 ? novaQuantidadeDisponivel : 0,
        localizacao,
        especificacoes_tecnicas: especificacoes_tecnicas ? JSON.parse(especificacoes_tecnicas) : recurso.especificacoes_tecnicas,
        ativo
      });

      res.json({ message: 'Recurso atualizado com sucesso', recurso });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar recurso' });
    }
  },

  async getRecursosDisponiveis(req, res) {
    try {
      const { data, hora_inicio, hora_fim } = req.query;

      if (!data || !hora_inicio || !hora_fim) {
        return res.status(400).json({ error: 'Data, hora_inicio e hora_fim são obrigatórios' });
      }

      // Buscar recursos que estão em agendamentos no horário solicitado
      const recursosOcupados = await AgendamentoRecurso.findAll({
        include: [{
          model: Agendamento,
          where: {
            data_agendamento: new Date(data),
            status: { [Op.in]: ['Agendado', 'Confirmado'] },
            [Op.or]: [
              {
                hora_inicio: { [Op.between]: [hora_inicio, hora_fim] }
              },
              {
                hora_fim: { [Op.between]: [hora_inicio, hora_fim] }
              },
              {
                [Op.and]: [
                  { hora_inicio: { [Op.lte]: hora_inicio } },
                  { hora_fim: { [Op.gte]: hora_fim } }
                ]
              }
            ]
          },
          required: true
        }]
      });

      const recursosOcupadosIds = recursosOcupados.map(ro => ro.id_recurso);

      // Buscar recursos disponíveis
      const recursosDisponiveis = await Recurso.findAll({
        where: {
          id_recurso: { [Op.notIn]: recursosOcupadosIds },
          quantidade_disponivel: { [Op.gt]: 0 },
          ativo: true
        },
        order: [['nome', 'ASC']]
      });

      res.json(recursosDisponiveis);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar recursos disponíveis' });
    }
  },

  async getHistoricoRecurso(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const historico = await AgendamentoRecurso.findAndCountAll({
        where: { id_recurso: id },
        include: [{
          model: Agendamento,
          include: [{
            model: Professor,
            attributes: ['nome', 'foto_url']
          }]
        }],
        order: [[Agendamento, 'data_agendamento', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        historico: historico.rows,
        total: historico.count,
        page: parseInt(page),
        totalPages: Math.ceil(historico.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar histórico do recurso' });
    }
  }
};

module.exports = recursosController;