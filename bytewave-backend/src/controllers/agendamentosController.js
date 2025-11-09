const { Agendamento, Sala, Professor, Turma, AgendamentoRecurso, Recurso } = require('../models');
const { Op } = require('sequelize');

const agendamentosController = {
  async getAgendamentos(req, res) {
    try {
      const { page = 1, limit = 20, sala, professor, data, status } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (sala) where.id_sala = sala;
      if (professor) where.id_professor = professor;
      if (status) where.status = status;
      
      if (data) {
        where.data_agendamento = new Date(data);
      }

      const agendamentos = await Agendamento.findAndCountAll({
        where,
        include: [
          {
            model: Sala,
            attributes: ['id_sala', 'nome', 'codigo', 'capacidade'],
            include: [{
              model: Predio,
              attributes: ['nome', 'codigo']
            }]
          },
          {
            model: Professor,
            attributes: ['id_professor', 'nome', 'foto_url']
          },
          {
            model: Turma,
            attributes: ['id_turma', 'nome', 'codigo']
          },
          {
            model: AgendamentoRecurso,
            include: [{
              model: Recurso,
              attributes: ['nome', 'tipo']
            }]
          }
        ],
        order: [['data_agendamento', 'ASC'], ['hora_inicio', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        agendamentos: agendamentos.rows,
        total: agendamentos.count,
        page: parseInt(page),
        totalPages: Math.ceil(agendamentos.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  },

  async getAgendamentoById(req, res) {
    try {
      const { id } = req.params;

      const agendamento = await Agendamento.findByPk(id, {
        include: [
          {
            model: Sala,
            include: [{
              model: Predio,
              attributes: ['nome', 'codigo', 'endereco']
            }]
          },
          {
            model: Professor,
            attributes: ['id_professor', 'nome', 'foto_url', 'email', 'telefone']
          },
          {
            model: Turma,
            attributes: ['id_turma', 'nome', 'codigo']
          },
          {
            model: AgendamentoRecurso,
            include: [{
              model: Recurso,
              attributes: ['id_recurso', 'nome', 'tipo', 'descricao']
            }]
          }
        ]
      });

      if (!agendamento) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      res.json(agendamento);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar agendamento' });
    }
  },

  async createAgendamento(req, res) {
    try {
      const {
        titulo,
        descricao,
        data_agendamento,
        hora_inicio,
        hora_fim,
        id_sala,
        id_turma,
        tipo_evento,
        recursos
      } = req.body;

      // Verificar conflito de horário
      const conflito = await Agendamento.findOne({
        where: {
          id_sala,
          data_agendamento: new Date(data_agendamento),
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
        }
      });

      if (conflito) {
        return res.status(400).json({ 
          error: 'Conflito de horário: a sala já está agendada neste período',
          conflito_com: conflito.titulo
        });
      }

      const agendamento = await Agendamento.create({
        titulo,
        descricao,
        data_agendamento: new Date(data_agendamento),
        hora_inicio,
        hora_fim,
        id_sala,
        id_professor: req.userId,
        id_turma: id_turma || null,
        tipo_evento: tipo_evento || 'Aula',
        status: 'Agendado'
      });

      // Adicionar recursos se fornecidos
      if (recursos && recursos.length > 0) {
        const recursosData = recursos.map(recurso => ({
          id_agendamento: agendamento.id_agendamento,
          id_recurso: recurso.id_recurso,
          quantidade_utilizada: recurso.quantidade || 1
        }));

        await AgendamentoRecurso.bulkCreate(recursosData);
      }

      const agendamentoCompleto = await Agendamento.findByPk(agendamento.id_agendamento, {
        include: [
          {
            model: Sala,
            attributes: ['nome', 'codigo']
          },
          {
            model: AgendamentoRecurso,
            include: [Recurso]
          }
        ]
      });

      res.status(201).json({
        message: 'Agendamento criado com sucesso',
        agendamento: agendamentoCompleto
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  },

  async updateAgendamento(req, res) {
    try {
      const { id } = req.params;
      const {
        titulo,
        descricao,
        data_agendamento,
        hora_inicio,
        hora_fim,
        status
      } = req.body;

      const agendamento = await Agendamento.findByPk(id);
      if (!agendamento) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      // Verificar se o professor é o dono do agendamento
      if (agendamento.id_professor !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para editar este agendamento' });
      }

      await agendamento.update({
        titulo,
        descricao,
        data_agendamento: data_agendamento ? new Date(data_agendamento) : agendamento.data_agendamento,
        hora_inicio,
        hora_fim,
        status
      });

      res.json({ message: 'Agendamento atualizado com sucesso', agendamento });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
  },

  async cancelarAgendamento(req, res) {
    try {
      const { id } = req.params;

      const agendamento = await Agendamento.findByPk(id);
      if (!agendamento) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      if (agendamento.id_professor !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para cancelar este agendamento' });
      }

      await agendamento.update({ status: 'Cancelado' });

      res.json({ message: 'Agendamento cancelado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao cancelar agendamento' });
    }
  },

  async getAgendamentosPorSala(req, res) {
    try {
      const { salaId } = req.params;
      const { data } = req.query;

      const where = { id_sala: salaId, status: { [Op.in]: ['Agendado', 'Confirmado'] } };
      
      if (data) {
        where.data_agendamento = new Date(data);
      } else {
        where.data_agendamento = { [Op.gte]: new Date() };
      }

      const agendamentos = await Agendamento.findAll({
        where,
        include: [
          {
            model: Professor,
            attributes: ['nome', 'foto_url']
          },
          {
            model: Turma,
            attributes: ['nome', 'codigo']
          }
        ],
        order: [['data_agendamento', 'ASC'], ['hora_inicio', 'ASC']]
      });

      res.json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar agendamentos da sala' });
    }
  }
};

module.exports = agendamentosController;