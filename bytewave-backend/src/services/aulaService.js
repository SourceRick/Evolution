import api from './api';

const aulaService = {
  async getAulas(params = {}) {
    try {
      const response = await api.get('/aulas', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar aulas' };
    }
  },

  async getAulaById(id) {
    try {
      const response = await api.get(`/aulas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar aula' };
    }
  },

  async getAulasByTurma(turmaId, params = {}) {
    try {
      const response = await api.get(`/aulas/turma/${turmaId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar aulas da turma' };
    }
  },

  async createAula(aulaData) {
    try {
      const response = await api.post('/aulas', aulaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar aula' };
    }
  },

  async updateAula(id, aulaData) {
    try {
      const response = await api.put(`/aulas/${id}`, aulaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar aula' };
    }
  },

  async registrarPresenca(aulaId, presencasData) {
    try {
      const response = await api.post(`/aulas/${aulaId}/presenca`, presencasData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao registrar presenças' };
    }
  }
};

export default aulaService;