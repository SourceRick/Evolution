import api from './api';

const recursoService = {
  async getRecursos(params = {}) {
    try {
      const response = await api.get('/recursos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar recursos' };
    }
  },

  async getRecursoById(id) {
    try {
      const response = await api.get(`/recursos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar recurso' };
    }
  },

  async getRecursosDisponiveis(params = {}) {
    try {
      const response = await api.get('/recursos/disponiveis', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar recursos disponíveis' };
    }
  },

  async getHistoricoRecurso(id, params = {}) {
    try {
      const response = await api.get(`/recursos/${id}/historico`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar histórico do recurso' };
    }
  },

  async createRecurso(recursoData) {
    try {
      const response = await api.post('/recursos', recursoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar recurso' };
    }
  },

  async updateRecurso(id, recursoData) {
    try {
      const response = await api.put(`/recursos/${id}`, recursoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar recurso' };
    }
  }
};

export default recursoService;