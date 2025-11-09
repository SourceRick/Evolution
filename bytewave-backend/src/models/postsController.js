const { Post, User, Professor, Aluno, Comentario, Reacao, Turma, Curso } = require('../models');

const postsController = {
  async getFeed(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const posts = await Post.findAndCountAll({
        include: [
          {
            model: User,
            as: 'autor',
            include: [
              { model: Professor, attributes: ['id_professor', 'nome', 'foto_url'] },
              { model: Aluno, attributes: ['id_aluno', 'nome', 'foto_url'] }
            ]
          },
          {
            model: Comentario,
            where: { ativo: true },
            required: false,
            include: [{
              model: User,
              include: [
                { model: Professor, attributes: ['nome', 'foto_url'] },
                { model: Aluno, attributes: ['nome', 'foto_url'] }
              ]
            }]
          },
          {
            model: Reacao,
            required: false
          },
          {
            model: Turma,
            attributes: ['id_turma', 'nome']
          },
          {
            model: Curso,
            attributes: ['id_curso', 'nome']
          }
        ],
        where: { ativo: true },
        order: [['fixado', 'DESC'], ['criado_em', 'DESC']],
        limit: parseInt(limit),
        offset: offset,
        distinct: true
      });

      res.json({
        posts: posts.rows,
        total: posts.count,
        page: parseInt(page),
        totalPages: Math.ceil(posts.count / limit)
      });
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      res.status(500).json({ error: 'Erro ao buscar feed' });
    }
  },

  async createPost(req, res) {
    try {
      const { titulo, conteudo, tipo, visibilidade, id_turma, id_curso, id_atividade } = req.body;
      
      if (!conteudo) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }

      const post = await Post.create({
        titulo,
        conteudo,
        tipo: tipo || 'Discussao',
        visibilidade: visibilidade || 'Turma',
        id_autor: req.userId,
        id_turma: id_turma || null,
        id_curso: id_curso || null,
        id_atividade: id_atividade || null,
        permite_comentarios: true
      });

      // Buscar post criado com autor
      const postCompleto = await Post.findByPk(post.id_post, {
        include: [{
          model: User,
          as: 'autor',
          include: [
            { model: Professor, attributes: ['nome', 'foto_url'] },
            { model: Aluno, attributes: ['nome', 'foto_url'] }
          ]
        }]
      });

      res.status(201).json(postCompleto);
    } catch (error) {
      console.error('Erro ao criar post:', error);
      res.status(500).json({ error: 'Erro ao criar post' });
    }
  },

  async getPostById(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id, {
        include: [
          {
            model: User,
            as: 'autor',
            include: [
              { model: Professor, attributes: ['nome', 'foto_url'] },
              { model: Aluno, attributes: ['nome', 'foto_url'] }
            ]
          },
          {
            model: Comentario,
            where: { ativo: true },
            required: false,
            include: [{
              model: User,
              include: [
                { model: Professor, attributes: ['nome', 'foto_url'] },
                { model: Aluno, attributes: ['nome', 'foto_url'] }
              ]
            }]
          },
          {
            model: Reacao,
            required: false
          }
        ]
      });

      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar post' });
    }
  },

  async deletePost(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      // Verificar se o usuário é o autor ou admin
      if (post.id_autor !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para excluir este post' });
      }

      await post.update({ ativo: false });

      res.json({ message: 'Post excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir post' });
    }
  }
};

module.exports = postsController;