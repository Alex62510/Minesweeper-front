import api from '../store/axios';

export const AuthApi = {
  async refresh() {
    const { data } = await api.post('/auth/refresh');
    return data; // { accessToken, userData }
  },

  async logout() {
    await api.post('/auth/logout');
  },
};
