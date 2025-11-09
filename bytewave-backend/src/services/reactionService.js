import api from './api';

const reactionService = {
  async addReaction(reactionData) {
    try {
      const response = await api.post('/reactions', reactionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao adicionar reação' };
    }
  },

  async getPostReactions(postId) {
    try {
      const response = await api.get(`/reactions/post/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar reações' };
    }
  },

  async removeReaction(id) {
    try {
      const response = await api.delete(`/reactions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao remover reação' };
    }
  }
};

export default reactionService;