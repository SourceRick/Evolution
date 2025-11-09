// Serviço para operações do dashboard
const API_BASE_URL = 'http://localhost:3000/api';

const dashboardService = {
  getDashboardData: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token inválido ou expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar dados do dashboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no dashboardService:', error);
      throw error;
    }
  },

  // Baseado na estrutura do seu backend, você pode adicionar outros métodos:
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar perfil do usuário');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  },

  // Adicione mais métodos conforme seus endpoints do backend
  updateUserProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
};

export default dashboardService;