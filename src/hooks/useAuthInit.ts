import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthApi } from '../api/auth.api.ts';

export const useAuthInit = () => {
  const login = useAuthStore((s) => s.login);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await AuthApi.refresh();
        login({
          accessToken: data.accessToken,
          user: data.userData,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setInitialized();
      }
    };

    initAuth();
  }, []);
};
