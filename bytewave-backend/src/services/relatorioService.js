import api from './api';

const relatorioService = {
  async getRelatorioAlunos(params = {}) {
    try {
      const response = await api.get('/relatorios/alunos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao gerar relatório de alunos' };
    }
  },

  async getRelatorioNotas(params = {}) {
    try {
      const response = await api.get('/relatorios/notas', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao gerar relatório de notas' };
    }
  },

  async getRelatorioPresencas(params = {}) {
    try {
      const response = await api.get('/relatorios/presencas', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao gerar relatório de presenças' };
    }
  },

  async getRelatorioAtividades(params = {}) {
    try {
      const response = await api.get('/relatorios/atividades', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao gerar relatório de atividades' };
    }
  },

  async getRelatorioFinanceiro(params = {}) {
    try {
      const response = await api.get('/relatorios/financeiro', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao gerar relatório financeiro' };
    }
  }
};

export default relatorioService;