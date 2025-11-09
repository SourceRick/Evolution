import api from './api';

const trabalhoService = {
  async getTrabalhos(params = {}) {
    try {
      const response = await api.get('/trabalhos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar trabalhos' };
    }
  },

  async getTrabalhoById(id) {
    try {
      const response = await api.get(`/trabalhos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar trabalho' };
    }
  },

  async getTrabalhosByAluno(alunoId, params = {}) {
    try {
      const response = await api.get(`/trabalhos/aluno/${alunoId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar trabalhos do aluno' };
    }
  },

  async createTrabalho(trabalhoData) {
    try {
      const response = await api.post('/trabalhos', trabalhoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar trabalho' };
    }
  },

  async updateTrabalho(id, trabalhoData) {
    try {
      const response = await api.put(`/trabalhos/${id}`, trabalhoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar trabalho' };
    }
  },

  async avaliarTrabalho(id, avaliacaoData) {
    try {
      const response = await api.patch(`/trabalhos/${id}/avaliar`, avaliacaoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao avaliar trabalho' };
    }
  }
};

export default trabalhoService;