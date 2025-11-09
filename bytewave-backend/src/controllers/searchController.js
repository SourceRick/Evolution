const { 
  Post, User, Professor, Aluno, Atividade, Turma, Curso, 
  Disciplina, Trabalho, Aula 
} = require('../models');
const { Op, Sequelize } = require('sequelize');

const searchController = {
  async searchGlobal(req, res) {
    try {
      const { q, tipo, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      if (!q || q.length < 3) {
        return res.status(400).json({ error: 'Termo de busca deve ter pelo menos 3 caracteres' });
      }

      const searchTerm = `%${q}%`;
      const results = {};

      // Buscar em Posts
      if (!tipo || tipo === 'posts') {
        const posts = await Post.findAndCountAll({
          where: {
            [Op.or]: [
              { titulo: { [Op.like]: searchTerm } },
              { conteudo: { [Op.like]: searchTerm } }
            ],
            ativo: true
          },
          include: [{
            model: User,
            as: 'autor',
            include: [
              { model: Professor, attributes: ['nome', 'foto_url'] },
              { model: Aluno, attributes: ['nome', 'foto_url'] }
            ]
          }],
          limit: parseInt(limit),
          offset: offset,
          order: [['criado_em', 'DESC']]
        });
        results.posts = posts;
      }

      // Buscar em Atividades
      if (!tipo || tipo === 'atividades') {
        const atividades = await Atividade.findAndCountAll({
          where: {
            [Op.or]: [
              { titulo: { [Op.like]: searchTerm } },
              { descricao: { [Op.like]: searchTerm } },
              { instrucoes: { [Op.like]: searchTerm } }
            ],
            ativa: true
          },
          include: [{
            model: Turma,
            attributes: ['nome', 'codigo']
          }],
          limit: parseInt(limit),
          offset: offset,
          order: [['data_entrega', 'DESC']]
        });
        results.atividades = atividades;
      }

      // Buscar em Usuários
      if (!tipo || tipo === 'usuarios') {
        const usuarios = await User.findAndCountAll({
          where: {
            [Op.or]: [
              { username: { [Op.like]: searchTerm } },
              { email: { [Op.like]: searchTerm } }
            ],
            ativo: true
          },
          include: [
            { model: Professor, attributes: ['nome', 'foto_url', 'especialidade'] },
            { model: Aluno, attributes: ['nome', 'foto_url', 'status'] }
          ],
          limit: parseInt(limit),
          offset: offset,
          order: [['username', 'ASC']]
        });
        results.usuarios = usuarios;
      }

      // Buscar em Turmas
      if (!tipo || tipo === 'turmas') {
        const turmas = await Turma.findAndCountAll({
          where: {
            [Op.or]: [
              { nome: { [Op.like]: searchTerm } },
              { codigo: { [Op.like]: searchTerm } }
            ],
            ativo: true
          },
          include: [{
            model: Curso,
            attributes: ['nome', 'codigo']
          }],
          limit: parseInt(limit),
          offset: offset,
          order: [['nome', 'ASC']]
        });
        results.turmas = turmas;
      }

      // Buscar em Cursos
      if (!tipo || tipo === 'cursos') {
        const cursos = await Curso.findAndCountAll({
          where: {
            [Op.or]: [
              { nome: { [Op.like]: searchTerm } },
              { codigo: { [Op.like]: searchTerm } },
              { descricao: { [Op.like]: searchTerm } }
            ],
            ativo: true
          },
          include: [{
            model: Departamento,
            attributes: ['nome']
          }],
          limit: parseInt(limit),
          offset: offset,
          order: [['nome', 'ASC']]
        });
        results.cursos = cursos;
      }

      // Buscar em Disciplinas
      if (!tipo || tipo === 'disciplinas') {
        const disciplinas = await Disciplina.findAndCountAll({
          where: {
            [Op.or]: [
              { nome: { [Op.like]: searchTerm } },
              { codigo: { [Op.like]: searchTerm } },
              { ementa: { [Op.like]: searchTerm } }
            ],
            ativo: true
          },
          include: [{
            model: Curso,
            attributes: ['nome', 'codigo']
          }],
          limit: parseInt(limit),
          offset: offset,
          order: [['nome', 'ASC']]
        });
        results.disciplinas = disciplinas;
      }

      // Calcular totais
      const totalResults = Object.values(results).reduce((total, result) => {
        return total + result.count;
      }, 0);

      res.json({
        termo: q,
        total: totalResults,
        resultados: results,
        page: parseInt(page),
        totalPages: Math.ceil(totalResults / limit)
      });
    } catch (error) {
      console.error('Erro na busca global:', error);
      res.status(500).json({ error: 'Erro ao realizar busca' });
    }
  },

  async searchAdvanced(req, res) {
    try {
      const { 
        q, 
        modulo, 
        campos, 
        data_inicio, 
        data_fim,
        page = 1, 
        limit = 20 
      } = req.query;
      const offset = (page - 1) * limit;

      if (!q || q.length < 2) {
        return res.status(400).json({ error: 'Termo de busca é obrigatório' });
      }

      const searchTerm = `%${q}%`;
      let where = {};

      // Construir where baseado no módulo e campos
      switch (modulo) {
        case 'posts':
          where = this.buildPostWhere(searchTerm, campos);
          break;
        case 'atividades':
          where = this.buildAtividadeWhere(searchTerm, campos);
          break;
        case 'usuarios':
          where = this.buildUsuarioWhere(searchTerm, campos);
          break;
        case 'trabalhos':
          where = this.buildTrabalhoWhere(searchTerm, campos);
          break;
        default:
          return res.status(400).json({ error: 'Módulo de busca inválido' });
      }

      // Adicionar filtro de data se fornecido
      if (data_inicio && data_fim) {
        const campoData = this.getCampoDataPorModulo(modulo);
        where[campoData] = {
          [Op.between]: [new Date(data_inicio), new Date(data_fim)]
        };
      }

      let results;
      switch (modulo) {
        case 'posts':
          results = await this.searchPosts(where, limit, offset);
          break;
        case 'atividades':
          results = await this.searchAtividades(where, limit, offset);
          break;
        case 'usuarios':
          results = await this.searchUsuarios(where, limit, offset);
          break;
        case 'trabalhos':
          results = await this.searchTrabalhos(where, limit, offset);
          break;
      }

      res.json({
        termo: q,
        modulo,
        total: results.count,
        resultados: results.rows,
        page: parseInt(page),
        totalPages: Math.ceil(results.count / limit)
      });
    } catch (error) {
      console.error('Erro na busca avançada:', error);
      res.status(500).json({ error: 'Erro ao realizar busca avançada' });
    }
  },

  // Métodos auxiliares para construção de queries
  buildPostWhere(term, campos) {
    const where = { ativo: true };
    const conditions = [];

    if (!campos || campos.includes('titulo')) {
      conditions.push({ titulo: { [Op.like]: term } });
    }
    if (!campos || campos.includes('conteudo')) {
      conditions.push({ conteudo: { [Op.like]: term } });
    }
    if (!campos || campos.includes('tipo')) {
      conditions.push({ tipo: { [Op.like]: term } });
    }

    where[Op.or] = conditions;
    return where;
  },

  buildAtividadeWhere(term, campos) {
    const where = { ativa: true };
    const conditions = [];

    if (!campos || campos.includes('titulo')) {
      conditions.push({ titulo: { [Op.like]: term } });
    }
    if (!campos || campos.includes('descricao')) {
      conditions.push({ descricao: { [Op.like]: term } });
    }
    if (!campos || campos.includes('instrucoes')) {
      conditions.push({ instrucoes: { [Op.like]: term } });
    }
    if (!campos || campos.includes('tipo')) {
      conditions.push({ tipo: { [Op.like]: term } });
    }

    where[Op.or] = conditions;
    return where;
  },

  buildUsuarioWhere(term, campos) {
    const where = { ativo: true };
    const conditions = [];

    if (!campos || campos.includes('username')) {
      conditions.push({ username: { [Op.like]: term } });
    }
    if (!campos || campos.includes('email')) {
      conditions.push({ email: { [Op.like]: term } });
    }
    if (!campos || campos.includes('tipo')) {
      conditions.push({ tipo: { [Op.like]: term } });
    }

    where[Op.or] = conditions;
    return where;
  },

  buildTrabalhoWhere(term, campos) {
    const where = {};
    const conditions = [];

    if (!campos || campos.includes('titulo')) {
      conditions.push({ titulo: { [Op.like]: term } });
    }
    if (!campos || campos.includes('conteudo')) {
      conditions.push({ conteudo: { [Op.like]: term } });
    }
    if (!campos || campos.includes('comentario_professor')) {
      conditions.push({ comentario_professor: { [Op.like]: term } });
    }

    where[Op.or] = conditions;
    return where;
  },

  getCampoDataPorModulo(modulo) {
    const camposData = {
      'posts': 'criado_em',
      'atividades': 'data_entrega',
      'trabalhos': 'data_entrega',
      'usuarios': 'criado_em'
    };
    return camposData[modulo] || 'criado_em';
  },

  // Métodos de busca específicos
  async searchPosts(where, limit, offset) {
    return await Post.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'autor',
        include: [
          { model: Professor, attributes: ['nome', 'foto_url'] },
          { model: Aluno, attributes: ['nome', 'foto_url'] }
        ]
      }],
      limit,
      offset,
      order: [['criado_em', 'DESC']]
    });
  },

  async searchAtividades(where, limit, offset) {
    return await Atividade.findAndCountAll({
      where,
      include: [{
        model: Turma,
        attributes: ['nome', 'codigo']
      }],
      limit,
      offset,
      order: [['data_entrega', 'DESC']]
    });
  },

  async searchUsuarios(where, limit, offset) {
    return await User.findAndCountAll({
      where,
      include: [
        { model: Professor, attributes: ['nome', 'foto_url'] },
        { model: Aluno, attributes: ['nome', 'foto_url'] }
      ],
      limit,
      offset,
      order: [['username', 'ASC']]
    });
  },

  async searchTrabalhos(where, limit, offset) {
    return await Trabalho.findAndCountAll({
      where,
      include: [
        {
          model: Atividade,
          attributes: ['titulo', 'valor_maximo']
        },
        {
          model: Aluno,
          attributes: ['nome', 'foto_url']
        }
      ],
      limit,
      offset,
      order: [['data_entrega', 'DESC']]
    });
  },

  async getSearchSuggestions(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.length < 2) {
        return res.json([]);
      }

      const term = `%${q}%`;
      const suggestions = [];

      // Sugestões de posts
      const postTitles = await Post.findAll({
        where: {
          titulo: { [Op.like]: term },
          ativo: true
        },
        attributes: ['titulo'],
        limit: 5,
        order: [['criado_em', 'DESC']]
      });

      suggestions.push(...postTitles.map(p => ({
        tipo: 'post',
        texto: p.titulo,
        icone: '📝'
      })));

      // Sugestões de atividades
      const activityTitles = await Atividade.findAll({
        where: {
          titulo: { [Op.like]: term },
          ativa: true
        },
        attributes: ['titulo'],
        limit: 5,
        order: [['data_entrega', 'DESC']]
      });

      suggestions.push(...activityTitles.map(a => ({
        tipo: 'atividade',
        texto: a.titulo,
        icone: '📚'
      })));

      // Sugestões de usuários
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.like]: term } },
            { email: { [Op.like]: term } }
          ],
          ativo: true
        },
        include: [
          { model: Professor, attributes: ['nome'] },
          { model: Aluno, attributes: ['nome'] }
        ],
        limit: 5,
        order: [['username', 'ASC']]
      });

      suggestions.push(...users.map(u => ({
        tipo: 'usuario',
        texto: u.Professor?.nome || u.Aluno?.nome || u.username,
        icone: '👤'
      })));

      res.json(suggestions.slice(0, 10)); // Limitar a 10 sugestões
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar sugestões' });
    }
  }
};

module.exports = searchController;