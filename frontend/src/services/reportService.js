import api from './api';

export const reportService = {
  async uploadReport(file, userId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await api.post('/reports/upload', formData);
    return response.data;
  },

  async getReports() {
    const response = await api.get('/reports');
    return response.data;
  },

  async getReport(id) {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  async getArParams(id) {
    const response = await api.get(`/reports/${id}/ar-params`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/reports/stats');
    return response.data;
  },
};
