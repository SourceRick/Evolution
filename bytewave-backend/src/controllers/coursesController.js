const { Curso, Departamento, Instituicao, Turma, Disciplina } = require('../models');

const coursesController = {
  async getAllCourses(req, res) {
    try {
      const { page = 1, limit = 20, departamento, ativo } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (departamento) where.id_departamento = departamento;
      if (ativo !== undefined) where.ativo = ativo === 'true';

      const cursos = await Curso.findAndCountAll({
        where,
        include: [
          {
            model: Departamento,
            include: [{
              model: Instituicao,
              attributes: ['nome']
            }]
          },
          {
            model: Turma,
            where: { ativo: true },
            required: false
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [['nome', 'ASC']]
      });

      res.json({
        cursos: cursos.rows,
        total: cursos.count,
        page: parseInt(page),
        totalPages: Math.ceil(cursos.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
  },

  async getCourseById(req, res) {
    try {
      const { id } = req.params;

      const curso = await Curso.findByPk(id, {
        include: [
          {
            model: Departamento,
            include: [{
              model: Instituicao,
              attributes: ['nome', 'logo_url']
            }]
          },
          {
            model: Turma,
            where: { ativo: true },
            required: false,
            include: [{
              model: Professor,
              as: 'coordenador',
              attributes: ['nome', 'foto_url']
            }]
          },
          {
            model: Disciplina,
            where: { ativo: true },
            required: false
          }
        ]
      });

      if (!curso) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      res.json(curso);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar curso' });
    }
  },

  async createCourse(req, res) {
    try {
      const { nome, codigo, descricao, carga_horaria_total, id_departamento } = req.body;

      const cursoExists = await Curso.findOne({ where: { codigo } });
      if (cursoExists) {
        return res.status(400).json({ error: 'Já existe um curso com este código' });
      }

      const curso = await Curso.create({
        nome,
        codigo,
        descricao,
        carga_horaria_total,
        id_departamento
      });

      res.status(201).json({
        message: 'Curso criado com sucesso',
        curso
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar curso' });
    }
  },

  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, carga_horaria_total, ativo } = req.body;

      const curso = await Curso.findByPk(id);
      if (!curso) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      await curso.update({
        nome,
        descricao,
        carga_horaria_total,
        ativo
      });

      res.json({ message: 'Curso atualizado com sucesso', curso });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar curso' });
    }
  },

  async getCourseStatistics(req, res) {
    try {
      const { id } = req.params;

      const curso = await Curso.findByPk(id, {
        include: [
          {
            model: Turma,
            include: [{
              model: Matricula,
              where: { status: 'Ativa' },
              required: false
            }]
          }
        ]
      });

      if (!curso) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      const statistics = {
        total_turmas: curso.Turmas.length,
        total_alunos: curso.Turmas.reduce((total, turma) => total + turma.Matriculas.length, 0),
        turmas_ativas: curso.Turmas.filter(t => t.ativo).length
      };

      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar estatísticas do curso' });
    }
  }
};

module.exports = coursesController;