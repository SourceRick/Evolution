import api from './api';

const turmaService = {
  async getAllTurmas(params = {}) {
    try {
      const response = await api.get('/turmas', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar turmas' };
    }
  },

  async getTurmaById(id) {
    try {
      const response = await api.get(`/turmas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar turma' };
    }
  },

  async getTurmaAlunos(id) {
    try {
      const response = await api.get(`/turmas/${id}/alunos`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar alunos da turma' };
    }
  },

  async getTurmaStatistics(id) {
    try {
      const response = await api.get(`/turmas/${id}/statistics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar estatísticas da turma' };
    }
  },

  async createTurma(turmaData) {
    try {
      const response = await api.post('/turmas', turmaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar turma' };
    }
  },

  async updateTurma(id, turmaData) {
    try {
      const response = await api.put(`/turmas/${id}`, turmaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar turma' };
    }
  }
};

export default turmaService;