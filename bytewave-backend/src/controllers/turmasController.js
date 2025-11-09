const { Turma, Curso, Professor, Matricula, Aluno, Aula, Atividade } = require('../models');

const turmasController = {
  async getAllTurmas(req, res) {
    try {
      const { page = 1, limit = 20, curso, turno, ativo } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (curso) where.id_curso = curso;
      if (turno) where.turno = turno;
      if (ativo !== undefined) where.ativo = ativo === 'true';

      const turmas = await Turma.findAndCountAll({
        where,
        include: [
          {
            model: Curso,
            attributes: ['id_curso', 'nome', 'codigo']
          },
          {
            model: Professor,
            as: 'coordenador',
            attributes: ['id_professor', 'nome', 'foto_url']
          },
          {
            model: Matricula,
            where: { status: 'Ativa' },
            required: false,
            include: [{
              model: Aluno,
              attributes: ['id_aluno', 'nome', 'foto_url']
            }]
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [['nome', 'ASC']]
      });

      res.json({
        turmas: turmas.rows,
        total: turmas.count,
        page: parseInt(page),
        totalPages: Math.ceil(turmas.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar turmas' });
    }
  },

  async getTurmaById(req, res) {
    try {
      const { id } = req.params;

      const turma = await Turma.findByPk(id, {
        include: [
          {
            model: Curso,
            attributes: ['id_curso', 'nome', 'codigo', 'carga_horaria_total']
          },
          {
            model: Professor,
            as: 'coordenador',
            attributes: ['id_professor', 'nome', 'foto_url', 'especialidade']
          },
          {
            model: Matricula,
            include: [{
              model: Aluno,
              attributes: ['id_aluno', 'nome', 'foto_url', 'email', 'status']
            }]
          },
          {
            model: Aula,
            required: false,
            order: [['data_aula', 'DESC']],
            limit: 10
          },
          {
            model: Atividade,
            where: { ativa: true },
            required: false,
            order: [['data_entrega', 'ASC']],
            limit: 10
          }
        ]
      });

      if (!turma) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      res.json(turma);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar turma' });
    }
  },

  async createTurma(req, res) {
    try {
      const { nome, codigo, turno, data_inicio, data_fim, capacidade_maxima, id_curso, id_professor_coordenador } = req.body;

      const turmaExists = await Turma.findOne({ where: { codigo } });
      if (turmaExists) {
        return res.status(400).json({ error: 'Já existe uma turma com este código' });
      }

      const turma = await Turma.create({
        nome,
        codigo,
        turno: turno || 'Manha',
        data_inicio,
        data_fim,
        capacidade_maxima: capacidade_maxima || 30,
        id_curso,
        id_professor_coordenador
      });

      res.status(201).json({
        message: 'Turma criada com sucesso',
        turma
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar turma' });
    }
  },

  async updateTurma(req, res) {
    try {
      const { id } = req.params;
      const { nome, turno, data_inicio, data_fim, capacidade_maxima, id_professor_coordenador, ativo } = req.body;

      const turma = await Turma.findByPk(id);
      if (!turma) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      await turma.update({
        nome,
        turno,
        data_inicio,
        data_fim,
        capacidade_maxima,
        id_professor_coordenador,
        ativo
      });

      res.json({ message: 'Turma atualizada com sucesso', turma });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar turma' });
    }
  },

  async getTurmaAlunos(req, res) {
    try {
      const { id } = req.params;

      const matriculas = await Matricula.findAll({
        where: { 
          id_turma: id,
          status: 'Ativa'
        },
        include: [{
          model: Aluno,
          attributes: ['id_aluno', 'nome', 'foto_url', 'email', 'data_nascimento', 'status']
        }],
        order: [[Aluno, 'nome', 'ASC']]
      });

      const alunos = matriculas.map(matricula => matricula.Aluno);

      res.json(alunos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar alunos da turma' });
    }
  },

  async getTurmaStatistics(req, res) {
    try {
      const { id } = req.params;

      const turma = await Turma.findByPk(id, {
        include: [
          {
            model: Matricula,
            include: [Aluno]
          },
          {
            model: Atividade,
            where: { ativa: true },
            required: false
          },
          {
            model: Aula,
            required: false
          }
        ]
      });

      if (!turma) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      const statistics = {
        total_alunos: turma.Matriculas.length,
        total_atividades: turma.Atividades.length,
        total_aulas: turma.Aulas.length,
        capacidade_utilizada: Math.round((turma.Matriculas.length / turma.capacidade_maxima) * 100)
      };

      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar estatísticas da turma' });
    }
  }
};

module.exports = turmasController;