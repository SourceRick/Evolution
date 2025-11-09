import api from './api';

const agendamentoService = {
  async getAgendamentos(params = {}) {
    try {
      const response = await api.get('/agendamentos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar agendamentos' };
    }
  },

  async getAgendamentoById(id) {
    try {
      const response = await api.get(`/agendamentos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar agendamento' };
    }
  },

  async getAgendamentosPorSala(salaId, params = {}) {
    try {
      const response = await api.get(`/agendamentos/sala/${salaId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar agendamentos da sala' };
    }
  },

  async createAgendamento(agendamentoData) {
    try {
      const response = await api.post('/agendamentos', agendamentoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar agendamento' };
    }
  },

  async updateAgendamento(id, agendamentoData) {
    try {
      const response = await api.put(`/agendamentos/${id}`, agendamentoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar agendamento' };
    }
  },

  async cancelarAgendamento(id) {
    try {
      const response = await api.patch(`/agendamentos/${id}/cancelar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao cancelar agendamento' };
    }
  }
};

export default agendamentoService;