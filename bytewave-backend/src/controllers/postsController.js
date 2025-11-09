const { Post, User, Professor, Aluno, Comentario, Reacao, Turma, Curso, PostArquivo } = require('../models');
const { Op } = require('sequelize');

const postsController = {
  async getFeed(req, res) {
    try {
      const { page = 1, limit = 20, turma, curso, tipo } = req.query;
      const offset = (page - 1) * limit;

      const where = { ativo: true };
      
      if (turma) where.id_turma = turma;
      if (curso) where.id_curso = curso;
      if (tipo) where.tipo = tipo;

      const posts = await Post.findAndCountAll({
        where,
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
              as: 'autor',
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
          },
          {
            model: PostArquivo,
            required: false
          }
        ],
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
      const { titulo, conteudo, tipo, visibilidade, id_turma, id_curso, id_atividade, fixado } = req.body;
      
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
        fixado: fixado || false,
        permite_comentarios: true
      });

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
              as: 'autor',
              include: [
                { model: Professor, attributes: ['nome', 'foto_url'] },
                { model: Aluno, attributes: ['nome', 'foto_url'] }
              ]
            }]
          },
          {
            model: Reacao,
            required: false,
            include: [{
              model: User,
              attributes: ['id_usuario', 'username']
            }]
          },
          {
            model: PostArquivo,
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

  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { titulo, conteudo, tipo, visibilidade, fixado } = req.body;

      const post = await Post.findByPk(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      if (post.id_autor !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para editar este post' });
      }

      await post.update({
        titulo,
        conteudo,
        tipo,
        visibilidade,
        fixado
      });

      res.json({ message: 'Post atualizado com sucesso', post });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar post' });
    }
  },

  async deletePost(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      if (post.id_autor !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para excluir este post' });
      }

      await post.update({ ativo: false });

      res.json({ message: 'Post excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir post' });
    }
  },

  async toggleFixarPost(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      if (req.userType !== 'admin' && req.userType !== 'professor') {
        return res.status(403).json({ error: 'Sem permissão para fixar posts' });
      }

      await post.update({ fixado: !post.fixado });

      res.json({ 
        message: `Post ${post.fixado ? 'fixado' : 'desfixado'} com sucesso`,
        fixado: post.fixado 
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao alterar fixação do post' });
    }
  }
};

module.exports = postsController;