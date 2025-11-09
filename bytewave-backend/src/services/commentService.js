import api from './api';

const commentService = {
  async getCommentsByPost(postId, params = {}) {
    try {
      const response = await api.get(`/comments/post/${postId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar comentários' };
    }
  },

  async createComment(postId, commentData) {
    try {
      const response = await api.post(`/comments/post/${postId}`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar comentário' };
    }
  },

  async updateComment(id, commentData) {
    try {
      const response = await api.put(`/comments/${id}`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar comentário' };
    }
  },

  async deleteComment(id) {
    try {
      const response = await api.delete(`/comments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar comentário' };
    }
  }
};

export default commentService;