import api from './api';

const configuracaoService = {
  // Configurações do sistema
  async getConfiguracoesSistema(params = {}) {
    try {
      const response = await api.get('/configuracoes/sistema', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar configurações do sistema' };
    }
  },

  async getConfiguracaoByChave(chave) {
    try {
      const response = await api.get(`/configuracoes/sistema/${chave}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar configuração' };
    }
  },

  async updateConfiguracao(chave, valor) {
    try {
      const response = await api.put(`/configuracoes/sistema/${chave}`, { valor });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar configuração' };
    }
  },

  async getEstatisticasSistema() {
    try {
      const response = await api.get('/configuracoes/sistema/estatisticas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar estatísticas do sistema' };
    }
  },

  // Atalhos de acessibilidade
  async getAtalhosAcessibilidade(params = {}) {
    try {
      const response = await api.get('/configuracoes/atalhos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar atalhos de acessibilidade' };
    }
  },

  async updateAtalhoAcessibilidade(id, ativo) {
    try {
      const response = await api.patch(`/configuracoes/atalhos/${id}`, { ativo });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar atalho' };
    }
  },

  // FAQs
  async getFaqs(params = {}) {
    try {
      const response = await api.get('/configuracoes/faqs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar FAQs' };
    }
  },

  async getFaqById(id) {
    try {
      const response = await api.get(`/configuracoes/faqs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar FAQ' };
    }
  },

  async createFaq(faqData) {
    try {
      const response = await api.post('/configuracoes/faqs', faqData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar FAQ' };
    }
  },

  async updateFaq(id, faqData) {
    try {
      const response = await api.put(`/configuracoes/faqs/${id}`, faqData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar FAQ' };
    }
  },

  async avaliarFaq(id, util) {
    try {
      const response = await api.patch(`/configuracoes/faqs/${id}/avaliar`, { util });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao avaliar FAQ' };
    }
  }
};

export default configuracaoService;