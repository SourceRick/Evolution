import api from './api';

const mensagemService = {
  async getMensagens(params = {}) {
    try {
      const response = await api.get('/mensagens', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar mensagens' };
    }
  },

  async getMensagemById(id) {
    try {
      const response = await api.get(`/mensagens/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar mensagem' };
    }
  },

  async getConversa(usuarioId, params = {}) {
    try {
      const response = await api.get(`/mensagens/conversa/${usuarioId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar conversa' };
    }
  },

  async enviarMensagem(mensagemData) {
    try {
      const response = await api.post('/mensagens', mensagemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao enviar mensagem' };
    }
  },

  async responderMensagem(id, respostaData) {
    try {
      const response = await api.post(`/mensagens/${id}/responder`, respostaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao responder mensagem' };
    }
  },

  async marcarComoLida(id) {
    try {
      const response = await api.patch(`/mensagens/${id}/lida`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao marcar mensagem como lida' };
    }
  }
};

export default mensagemService;