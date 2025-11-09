const { Reacao, Post, Comentario } = require('../models');

const reactionsController = {
  async addReaction(req, res) {
    try {
      const { tipo, id_post, id_comentario } = req.body;

      if (!id_post && !id_comentario) {
        return res.status(400).json({ error: 'ID do post ou comentário é obrigatório' });
      }

      // Verificar se já existe reação do usuário
      const existingReaction = await Reacao.findOne({
        where: {
          id_usuario: req.userId,
          [Op.or]: [
            { id_post: id_post || null },
            { id_comentario: id_comentario || null }
          ]
        }
      });

      if (existingReaction) {
        // Se já existe e é do mesmo tipo, remove
        if (existingReaction.tipo === tipo) {
          await existingReaction.destroy();
          return res.json({ 
            message: 'Reação removida com sucesso',
            reaction: null 
          });
        } else {
          // Se é tipo diferente, atualiza
          await existingReaction.update({ tipo });
          return res.json({ 
            message: 'Reação atualizada com sucesso',
            reaction: existingReaction 
          });
        }
      }

      // Criar nova reação
      const reaction = await Reacao.create({
        id_post: id_post || null,
        id_comentario: id_comentario || null,
        id_usuario: req.userId,
        tipo: tipo || 'like'
      });

      res.status(201).json({
        message: 'Reação adicionada com sucesso',
        reaction
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao adicionar reação' });
    }
  },

  async getPostReactions(req, res) {
    try {
      const { postId } = req.params;

      const reactions = await Reacao.findAll({
        where: { id_post: postId },
        include: [{
          model: User,
          attributes: ['id_usuario', 'username']
        }]
      });

      // Agrupar por tipo
      const reactionsByType = reactions.reduce((acc, reaction) => {
        if (!acc[reaction.tipo]) {
          acc[reaction.tipo] = [];
        }
        acc[reaction.tipo].push(reaction.User);
        return acc;
      }, {});

      res.json(reactionsByType);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar reações' });
    }
  },

  async removeReaction(req, res) {
    try {
      const { id } = req.params;

      const reaction = await Reacao.findByPk(id);
      
      if (!reaction) {
        return res.status(404).json({ error: 'Reação não encontrada' });
      }

      if (reaction.id_usuario !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para remover esta reação' });
      }

      await reaction.destroy();

      res.json({ message: 'Reação removida com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover reação' });
    }
  }
};

module.exports = reactionsController;