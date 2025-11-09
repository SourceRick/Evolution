import api from './api';

const notificacaoService = {
  async getNotificacoes(params = {}) {
    try {
      const response = await api.get('/notificacoes', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar notificações' };
    }
  },

  async getNotificacaoById(id) {
    try {
      const response = await api.get(`/notificacoes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar notificação' };
    }
  },

  async getEstatisticasNotificacoes() {
    try {
      const response = await api.get('/notificacoes/estatisticas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar estatísticas de notificações' };
    }
  },

  async criarNotificacao(notificacaoData) {
    try {
      const response = await api.post('/notificacoes', notificacaoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar notificação' };
    }
  },

  async marcarComoLida(id) {
    try {
      const response = await api.patch(`/notificacoes/${id}/lida`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao marcar notificação como lida' };
    }
  },

  async marcarTodasComoLidas() {
    try {
      const response = await api.patch('/notificacoes/marcar-todas-lidas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao marcar notificações como lidas' };
    }
  },

  async deletarNotificacao(id) {
    try {
      const response = await api.delete(`/notificacoes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar notificação' };
    }
  }
};

export default notificacaoService;