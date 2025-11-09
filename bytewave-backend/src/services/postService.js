import api from './api';

const postService = {
  async getFeed(params = {}) {
    try {
      const response = await api.get('/posts/feed', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar feed' };
    }
  },

  async getPostById(id) {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar post' };
    }
  },

  async createPost(postData) {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar post' };
    }
  },

  async updatePost(id, postData) {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar post' };
    }
  },

  async deletePost(id) {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar post' };
    }
  },

  async toggleFixarPost(id) {
    try {
      const response = await api.patch(`/posts/${id}/fixar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao fixar/desfixar post' };
    }
  }
};

export default postService;