import api from './api';

const presencaService = {
  async getPresencas(params = {}) {
    try {
      const response = await api.get('/presencas', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar presenças' };
    }
  },

  async getPresencaAluno(alunoId, params = {}) {
    try {
      const response = await api.get(`/presencas/aluno/${alunoId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar presenças do aluno' };
    }
  },

  async getJustificativasPendentes(params = {}) {
    try {
      const response = await api.get('/presencas/justificativas/pendentes', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar justificativas pendentes' };
    }
  },

  async justificarFalta(presencaId, justificativaData) {
    try {
      const response = await api.post(`/presencas/${presencaId}/justificar`, justificativaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao justificar falta' };
    }
  },

  async avaliarJustificativa(justificativaId, avaliacaoData) {
    try {
      const response = await api.patch(`/presencas/justificativa/${justificativaId}/avaliar`, avaliacaoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao avaliar justificativa' };
    }
  }
};

export default presencaService;