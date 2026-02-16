import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // ❗ Не делать refresh для auth-эндпоинтов
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/')
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        console.log('!!!!!!!!!!!', data);
        const newAccessToken = data.accessToken;
        useAuthStore.getState().setAccessToken(newAccessToken);
        useAuthStore.getState().setUser(data.userData);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
