import api from './api';

const courseService = {
  async getAllCourses(params = {}) {
    try {
      const response = await api.get('/courses', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar cursos' };
    }
  },

  async getCourseById(id) {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar curso' };
    }
  },

  async getCourseStatistics(id) {
    try {
      const response = await api.get(`/courses/${id}/statistics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao buscar estatísticas do curso' };
    }
  },

  async createCourse(courseData) {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar curso' };
    }
  },

  async updateCourse(id, courseData) {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao atualizar curso' };
    }
  }
};

export default courseService;