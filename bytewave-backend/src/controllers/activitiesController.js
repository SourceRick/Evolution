const { Atividade, Turma, Professor, Disciplina, Trabalho, Aluno } = require('../models');
const { Op } = require('sequelize');

const activitiesController = {
  async getActivities(req, res) {
    try {
      const { page = 1, limit = 20, turma, disciplina, tipo, ativa } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (turma) where.id_turma = turma;
      if (disciplina) where.id_disciplina = disciplina;
      if (tipo) where.tipo = tipo;
      if (ativa !== undefined) where.ativa = ativa === 'true';

      const atividades = await Atividade.findAndCountAll({
        where,
        include: [
          {
            model: Turma,
            attributes: ['id_turma', 'nome', 'codigo']
          },
          {
            model: Professor,
            attributes: ['id_professor', 'nome', 'foto_url']
          },
          {
            model: Disciplina,
            attributes: ['id_disciplina', 'nome', 'codigo']
          },
          {
            model: Trabalho,
            required: false
          }
        ],
        order: [['data_entrega', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        atividades: atividades.rows,
        total: atividades.count,
        page: parseInt(page),
        totalPages: Math.ceil(atividades.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar atividades' });
    }
  },

  async getActivityById(req, res) {
    try {
      const { id } = req.params;

      const atividade = await Atividade.findByPk(id, {
        include: [
          {
            model: Turma,
            attributes: ['id_turma', 'nome', 'codigo']
          },
          {
            model: Professor,
            attributes: ['id_professor', 'nome', 'foto_url', 'especialidade']
          },
          {
            model: Disciplina,
            attributes: ['id_disciplina', 'nome', 'codigo', 'carga_horaria']
          },
          {
            model: Trabalho,
            include: [{
              model: Aluno,
              attributes: ['id_aluno', 'nome', 'foto_url']
            }]
          }
        ]
      });

      if (!atividade) {
        return res.status(404).json({ error: 'Atividade não encontrada' });
      }

      res.json(atividade);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar atividade' });
    }
  },

  async createActivity(req, res) {
    try {
      const {
        titulo,
        descricao,
        tipo,
        data_inicio,
        data_entrega,
        id_disciplina,
        id_turma,
        valor_maximo,
        instrucoes,
        criterios_avaliacao,
        anexos_permitidos,
        tipos_arquivo_permitidos,
        tamanho_maximo_mb,
        visibilidade
      } = req.body;

      // Verificar se o professor é da turma
      if (req.userType === 'professor') {
        // Aqui você pode adicionar validação se o professor pertence à turma
      }

      const atividade = await Atividade.create({
        titulo,
        descricao,
        tipo: tipo || 'Trabalho',
        data_inicio: data_inicio || new Date(),
        data_entrega,
        id_disciplina: id_disciplina || null,
        id_turma,
        id_professor: req.userId,
        valor_maximo: valor_maximo || 10.00,
        instrucoes,
        criterios_avaliacao: criterios_avaliacao ? JSON.parse(criterios_avaliacao) : null,
        anexos_permitidos: anexos_permitidos !== false,
        tipos_arquivo_permitidos: tipos_arquivo_permitidos ? JSON.parse(tipos_arquivo_permitidos) : ['pdf', 'doc', 'docx', 'jpg', 'png'],
        tamanho_maximo_mb: tamanho_maximo_mb || 10,
        visibilidade: visibilidade || 'Turma'
      });

      res.status(201).json({
        message: 'Atividade criada com sucesso',
        atividade
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar atividade' });
    }
  },

  async updateActivity(req, res) {
    try {
      const { id } = req.params;
      const {
        titulo,
        descricao,
        data_inicio,
        data_entrega,
        valor_maximo,
        instrucoes,
        ativa
      } = req.body;

      const atividade = await Atividade.findByPk(id);
      if (!atividade) {
        return res.status(404).json({ error: 'Atividade não encontrada' });
      }

      // Verificar se o usuário é o professor criador ou admin
      if (atividade.id_professor !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para editar esta atividade' });
      }

      await atividade.update({
        titulo,
        descricao,
        data_inicio,
        data_entrega,
        valor_maximo,
        instrucoes,
        ativa
      });

      res.json({ message: 'Atividade atualizada com sucesso', atividade });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar atividade' });
    }
  },

  async getStudentActivities(req, res) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const offset = (page - 1) * limit;

      // Buscar turmas do aluno
      const matriculas = await Matricula.findAll({
        where: { 
          id_aluno: req.userId,
          status: 'Ativa'
        },
        attributes: ['id_turma']
      });

      const turmaIds = matriculas.map(m => m.id_turma);

      const where = {
        id_turma: { [Op.in]: turmaIds },
        ativa: true
      };

      const atividades = await Atividade.findAndCountAll({
        where,
        include: [
          {
            model: Turma,
            attributes: ['id_turma', 'nome']
          },
          {
            model: Professor,
            attributes: ['id_professor', 'nome', 'foto_url']
          },
          {
            model: Disciplina,
            attributes: ['id_disciplina', 'nome']
          },
          {
            model: Trabalho,
            where: { id_aluno: req.userId },
            required: false
          }
        ],
        order: [['data_entrega', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      // Adicionar status do trabalho do aluno
      const atividadesComStatus = atividades.rows.map(atividade => {
        const trabalho = atividade.Trabalhos[0];
        return {
          ...atividade.toJSON(),
          status_aluno: trabalho ? trabalho.status : 'Pendente',
          data_entrega_aluno: trabalho ? trabalho.data_entrega : null,
          nota_aluno: trabalho ? trabalho.nota : null
        };
      });

      res.json({
        atividades: atividadesComStatus,
        total: atividades.count,
        page: parseInt(page),
        totalPages: Math.ceil(atividades.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar atividades do aluno' });
    }
  },

  async getUpcomingActivities(req, res) {
    try {
      const atividades = await Atividade.findAll({
        where: {
          data_entrega: {
            [Op.gte]: new Date(),
            [Op.lte]: new Date(new Date().setDate(new Date().getDate() + 7)) // Próximos 7 dias
          },
          ativa: true
        },
        include: [
          {
            model: Turma,
            attributes: ['id_turma', 'nome']
          },
          {
            model: Disciplina,
            attributes: ['id_disciplina', 'nome']
          }
        ],
        order: [['data_entrega', 'ASC']],
        limit: 10
      });

      res.json(atividades);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar atividades próximas' });
    }
  }
};

module.exports = activitiesController;