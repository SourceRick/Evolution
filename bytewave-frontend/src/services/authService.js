/* eslint-disable no-unused-vars */
import api from './api';

const authService = {
  /**
   * Realiza o login do usuário
   * @param {Object} credentials - Credenciais de login
   * @param {string} credentials.email - Email do usuário
   * @param {string} credentials.senha - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário e token
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        // Salvar token e dados do usuário no localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Configurar header de autorização para requisições futuras
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      // Tratamento específico de erros de login
      if (error.response?.status === 401) {
        throw { error: 'Email ou senha incorretos' };
      } else if (error.response?.status === 403) {
        throw { error: 'Usuário inativo ou sem permissão' };
      } else if (error.response?.data?.error) {
        throw error.response.data;
      } else {
        throw { error: 'Erro de conexão. Tente novamente.' };
      }
    }
  },

  /**
   * Busca os dados do usuário atual
   * @returns {Promise<Object>} Dados completos do usuário
   */
  async getMe() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logout();
        throw { error: 'Sessão expirada. Faça login novamente.' };
      }
      throw error.response?.data || { error: 'Erro ao buscar dados do usuário' };
    }
  },

  /**
   * Atualiza o perfil do usuário
   * @param {Object} profileData - Dados do perfil para atualizar
   * @returns {Promise<Object>} Resultado da atualização
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      // Atualizar dados do usuário no localStorage
      if (response.data.user) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar perfil' };
    }
  },

  /**
   * Altera a senha do usuário
   * @param {Object} passwordData - Dados para alteração de senha
   * @param {string} passwordData.senha_atual - Senha atual
   * @param {string} passwordData.nova_senha - Nova senha
   * @returns {Promise<Object>} Resultado da alteração
   */
  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw { error: 'Senha atual incorreta' };
      }
      throw error.response?.data || { error: 'Erro ao alterar senha' };
    }
  },

  /**
   * Realiza o logout do usuário
   */
  logout() {
    // Remover dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('bytewave-theme');
    
    // Remover header de autorização
    delete api.defaults.headers.common['Authorization'];
    
    // Redirecionar para login (se estiver em ambiente de navegador)
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} True se estiver autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  /**
   * Obtém o usuário atual do localStorage
   * @returns {Object|null} Dados do usuário ou null
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erro ao parsear dados do usuário:', error);
      return null;
    }
  },

  /**
   * Obtém o tipo do usuário atual
   * @returns {string|null} Tipo do usuário (admin, professor, aluno) ou null
   */
  getUserType() {
    const user = this.getCurrentUser();
    return user?.tipo || null;
  },

  /**
   * Obtém o token de autenticação
   * @returns {string|null} Token JWT ou null
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Valida se o token ainda é válido
   * @returns {Promise<boolean>} True se o token for válido
   */
  async validateToken() {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      await this.getMe();
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  },

  /**
   * Atualiza os dados do usuário no localStorage
   * @param {Object} userData - Novos dados do usuário
   */
  updateLocalUser(userData) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },

  /**
   * Verifica se o usuário tem uma role específica
   * @param {string|string[]} roles - Role ou array de roles para verificar
   * @returns {boolean} True se o usuário tiver a role
   */
  hasRole(roles) {
    const userType = this.getUserType();
    if (!userType) return false;

    if (Array.isArray(roles)) {
      return roles.includes(userType);
    }
    
    return userType === roles;
  },

  /**
   * Verifica permissões específicas baseadas no tipo de usuário
   * @returns {Object} Objeto com métodos de verificação de permissão
   */
  getPermissions() {
    const userType = this.getUserType();
    
    return {
      // Admin tem acesso total
      isAdmin: () => userType === 'admin',
      
      // Professor pode gerenciar turmas, atividades, etc.
      isProfessor: () => userType === 'professor',
      
      // Aluno tem acesso limitado
      isAluno: () => userType === 'aluno',
      
      // Permissões específicas
      canManageUsers: () => ['admin'].includes(userType),
      canManageCourses: () => ['admin', 'professor'].includes(userType),
      canManageActivities: () => ['admin', 'professor'].includes(userType),
      canViewGrades: () => ['admin', 'professor', 'aluno'].includes(userType),
      canViewReports: () => ['admin', 'professor'].includes(userType),
      
      // Verifica se pode acessar um recurso específico
      canAccess: (resource) => {
        const permissions = {
          'users': ['admin'],
          'courses': ['admin', 'professor'],
          'turmas': ['admin', 'professor', 'aluno'],
          'activities': ['admin', 'professor', 'aluno'],
          'agendamentos': ['admin', 'professor'],
          'relatorios': ['admin', 'professor'],
          'configuracoes': ['admin', 'professor', 'aluno']
        };
        
        return permissions[resource]?.includes(userType) || false;
      }
    };
  },

  /**
   * Recuperação de senha (primeiro passo - solicitação)
   * @param {string} email - Email para recuperação
   * @returns {Promise<Object>} Resultado da solicitação
   */
  async requestPasswordReset(email) {
    try {
      // Esta rota precisaria ser implementada no backend
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao solicitar recuperação de senha' };
    }
  },

  /**
   * Redefinição de senha (segundo passo - com token)
   * @param {Object} resetData - Dados para redefinição
   * @param {string} resetData.token - Token de redefinição
   * @param {string} resetData.nova_senha - Nova senha
   * @returns {Promise<Object>} Resultado da redefinição
   */
  async resetPassword(resetData) {
    try {
      // Esta rota precisaria ser implementada no backend
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao redefinir senha' };
    }
  },

  /**
   * Verifica se o email já está cadastrado
   * @param {string} email - Email para verificar
   * @returns {Promise<boolean>} True se o email estiver disponível
   */
  async checkEmailAvailability(email) {
    try {
      // Esta rota precisaria ser implementada no backend
      const response = await api.get(`/auth/check-email/${email}`);
      return response.data.available;
    } catch (error) {
      // Se der erro, assumimos que o email está disponível
      return true;
    }
  },

  /**
   * Registro de novo usuário (se aplicável)
   * @param {Object} userData - Dados do novo usuário
   * @returns {Promise<Object>} Resultado do registro
   */
  async register(userData) {
    try {
      // Esta rota precisaria ser implementada no backend
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw { error: 'Email já cadastrado' };
      }
      throw error.response?.data || { error: 'Erro ao criar conta' };
    }
  },

  /**
   * Renova o token de autenticação
   * @returns {Promise<Object>} Novo token e dados
   */
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      this.logout();
      throw { error: 'Falha ao renovar sessão' };
    }
  }
};

// Configurar interceptor para renovação automática de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar renovar o token
        await authService.refreshToken();
        
        // Reexecutar a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        // Se não conseguir renovar, fazer logout
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authService;