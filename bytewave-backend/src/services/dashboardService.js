import api from './api';

const dashboardService = {
  async getDashboardAluno() {
    try {
      const response = await api.get('/dashboard/aluno');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao carregar dashboard do aluno' };
    }
  },

  async getDashboardProfessor() {
    try {
      const response = await api.get('/dashboard/professor');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao carregar dashboard do professor' };
    }
  },

  async getDashboardAdmin() {
    try {
      const response = await api.get('/dashboard/admin');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao carregar dashboard do admin' };
    }
  }
};

export default dashboardService;