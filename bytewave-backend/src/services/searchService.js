import api from './api';

const searchService = {
  async searchGlobal(query, params = {}) {
    try {
      const response = await api.get('/search/global', {
        params: { q: query, ...params },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao realizar busca global' };
    }
  },

  async searchAdvanced(query, params = {}) {
    try {
      const response = await api.get('/search/avancada', {
        params: { q: query, ...params },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao realizar busca avançada' };
    }
  },

  async getSearchSuggestions(query) {
    try {
      const response = await api.get('/search/sugestoes', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar sugestões' };
    }
  }
};

export default searchService;