const { Comentario, User, Professor, Aluno, Post } = require('../models');

const commentsController = {
  async getCommentsByPost(req, res) {
    try {
      const { postId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      const comments = await Comentario.findAndCountAll({
        where: { 
          id_post: postId,
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
        order: [['criado_em', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        comments: comments.rows,
        total: comments.count,
        page: parseInt(page),
        totalPages: Math.ceil(comments.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
  },

  async createComment(req, res) {
    try {
      const { postId } = req.params;
      const { conteudo, id_comentario_pai } = req.body;

      if (!conteudo) {
        return res.status(400).json({ error: 'Conteúdo é obrigatório' });
      }

      // Verificar se post existe
      const post = await Post.findByPk(postId);
      if (!post || !post.ativo) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      if (!post.permite_comentarios) {
        return res.status(400).json({ error: 'Comentários não permitidos para este post' });
      }

      const comment = await Comentario.create({
        id_post: postId,
        id_autor: req.userId,
        conteudo,
        id_comentario_pai: id_comentario_pai || null
      });

      const commentWithAuthor = await Comentario.findByPk(comment.id_comentario, {
        include: [{
          model: User,
          as: 'autor',
          include: [
            { model: Professor, attributes: ['nome', 'foto_url'] },
            { model: Aluno, attributes: ['nome', 'foto_url'] }
          ]
        }]
      });

      res.status(201).json(commentWithAuthor);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar comentário' });
    }
  },

  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { conteudo } = req.body;

      const comment = await Comentario.findByPk(id);
      
      if (!comment) {
        return res.status(404).json({ error: 'Comentário não encontrado' });
      }

      if (comment.id_autor !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para editar este comentário' });
      }

      await comment.update({
        conteudo,
        editado: true
      });

      res.json({ message: 'Comentário atualizado com sucesso', comment });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
  },

  async deleteComment(req, res) {
    try {
      const { id } = req.params;

      const comment = await Comentario.findByPk(id);
      
      if (!comment) {
        return res.status(404).json({ error: 'Comentário não encontrado' });
      }

      if (comment.id_autor !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para excluir este comentário' });
      }

      await comment.update({ ativo: false });

      res.json({ message: 'Comentário excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir comentário' });
    }
  }
};

module.exports = commentsController;