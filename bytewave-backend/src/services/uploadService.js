import api from './api';

const uploadService = {
  async uploadArquivoTrabalho(formData) {
    try {
      const response = await api.post('/upload/trabalho', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao fazer upload do arquivo' };
    }
  },

  async uploadArquivoPost(formData) {
    try {
      const response = await api.post('/upload/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao fazer upload do arquivo' };
    }
  },

  async getArquivosPorTrabalho(trabalhoId) {
    try {
      const response = await api.get(`/upload/trabalho/${trabalhoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar arquivos do trabalho' };
    }
  },

  async getArquivosPorPost(postId) {
    try {
      const response = await api.get(`/upload/post/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar arquivos do post' };
    }
  },

  async downloadArquivo(tipo, id) {
    try {
      const response = await api.get(`/upload/download/${tipo}/${id}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao fazer download do arquivo' };
    }
  },

  async visualizarArquivo(tipo, id) {
    try {
      const response = await api.get(`/upload/visualizar/${tipo}/${id}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao visualizar arquivo' };
    }
  },

  async deletarArquivo(tipo, id) {
    try {
      const response = await api.delete(`/upload/${tipo}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao deletar arquivo' };
    }
  }
};

export default uploadService;