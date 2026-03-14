import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/user/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/user/login', { email, password });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/user/logout');
    } finally {
      localStorage.removeItem('ems_token');
      localStorage.removeItem('ems_user');
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/user/change-password', { currentPassword, newPassword });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me'); // keeping this if it exists, otherwise it might fail. Let's ask.
    return response.data;
  },
};
