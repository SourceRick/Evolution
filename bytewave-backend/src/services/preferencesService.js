import api from './api';

const preferencesService = {
  async getPreferences() {
    try {
      const response = await api.get('/preferences');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar preferências' };
    }
  },

  async updatePreferences(preferencesData) {
    try {
      const response = await api.put('/preferences', preferencesData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar preferências' };
    }
  }
};

export default preferencesService;