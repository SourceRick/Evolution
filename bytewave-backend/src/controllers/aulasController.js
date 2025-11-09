const { Aula, Disciplina, Turma, Professor, Presenca, Aluno } = require('../models');
const { Op } = require('sequelize');

const aulasController = {
  async getAulas(req, res) {
    try {
      const { page = 1, limit = 20, turma, disciplina, data_inicio, data_fim } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (turma) where.id_turma = turma;
      if (disciplina) where.id_disciplina = disciplina;
      
      if (data_inicio && data_fim) {
        where.data_aula = {
          [Op.between]: [new Date(data_inicio), new Date(data_fim)]
        };
      }

      const aulas = await Aula.findAndCountAll({
        where,
        include: [
          {
            model: Disciplina,
            attributes: ['id_disciplina', 'nome', 'codigo']
          },
          {
            model: Turma,
            attributes: ['id_turma', 'nome', 'codigo']
          },
          {
            model: Professor,
            attributes: ['id_professor', 'nome', 'foto_url']
          },
          {
            model: Presenca,
            required: false
          }
        ],
        order: [['data_aula', 'DESC'], ['hora_inicio', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        aulas: aulas.rows,
        total: aulas.count,
        page: parseInt(page),
        totalPages: Math.ceil(aulas.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar aulas' });
    }
  },

  async getAulaById(req, res) {
    try {
      const { id } = req.params;

      const aula = await Aula.findByPk(id, {
        include: [
          {
            model: Disciplina,
            attributes: ['id_disciplina', 'nome', 'codigo']
          },
          {
            model: Turma,
            attributes: ['id_turma', 'nome', 'codigo']
          },
          {
            model: Professor,
            attributes: ['id_professor', 'nome', 'foto_url', 'especialidade']
          },
          {
            model: Presenca,
            include: [{
              model: Aluno,
              attributes: ['id_aluno', 'nome', 'foto_url']
            }]
          }
        ]
      });

      if (!aula) {
        return res.status(404).json({ error: 'Aula não encontrada' });
      }

      res.json(aula);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar aula' });
    }
  },

  async createAula(req, res) {
    try {
      const {
        id_disciplina,
        id_turma,
        data_aula,
        hora_inicio,
        hora_fim,
        conteudo_ministrado,
        observacoes
      } = req.body;

      const aula = await Aula.create({
        id_disciplina,
        id_turma,
        id_professor: req.userId,
        data_aula,
        hora_inicio,
        hora_fim,
        conteudo_ministrado,
        observacoes
      });

      res.status(201).json({
        message: 'Aula criada com sucesso',
        aula
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar aula' });
    }
  },

  async updateAula(req, res) {
    try {
      const { id } = req.params;
      const {
        data_aula,
        hora_inicio,
        hora_fim,
        conteudo_ministrado,
        observacoes,
        presenca_registrada
      } = req.body;

      const aula = await Aula.findByPk(id);
      if (!aula) {
        return res.status(404).json({ error: 'Aula não encontrada' });
      }

      // Verificar se o professor é o dono da aula
      if (aula.id_professor !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para editar esta aula' });
      }

      await aula.update({
        data_aula,
        hora_inicio,
        hora_fim,
        conteudo_ministrado,
        observacoes,
        presenca_registrada
      });

      res.json({ message: 'Aula atualizada com sucesso', aula });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar aula' });
    }
  },

  async registrarPresenca(req, res) {
    try {
      const { id } = req.params;
      const { presencas } = req.body; // Array de { id_aluno, status, observacoes }

      const aula = await Aula.findByPk(id);
      if (!aula) {
        return res.status(404).json({ error: 'Aula não encontrada' });
      }

      // Apenas professores podem registrar presença
      if (req.userType !== 'professor' && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para registrar presença' });
      }

      const resultados = [];

      for (const presenca of presencas) {
        const [registro, created] = await Presenca.upsert({
          id_aula: id,
          id_aluno: presenca.id_aluno,
          status: presenca.status || 'Presente',
          observacoes: presenca.observacoes,
          registrado_por: req.userId
        }, {
          returning: true
        });

        resultados.push(registro);
      }

      // Marcar aula como tendo presença registrada
      await aula.update({ presenca_registrada: true });

      res.json({
        message: 'Presenças registradas com sucesso',
        presencas: resultados
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar presenças' });
    }
  },

  async getAulasByTurma(req, res) {
    try {
      const { turmaId } = req.params;
      const { data } = req.query;

      const where = { id_turma: turmaId };
      if (data) {
        where.data_aula = new Date(data);
      }

      const aulas = await Aula.findAll({
        where,
        include: [
          {
            model: Disciplina,
            attributes: ['id_disciplina', 'nome', 'codigo']
          },
          {
            model: Professor,
            attributes: ['id_professor', 'nome', 'foto_url']
          }
        ],
        order: [['data_aula', 'DESC'], ['hora_inicio', 'ASC']]
      });

      res.json(aulas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar aulas da turma' });
    }
  }
};

module.exports = aulasController;