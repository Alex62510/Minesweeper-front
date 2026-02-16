import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuth: boolean;
  initialized: boolean;
  setInitialized: () => void;
  login: (data: { accessToken: string; user: User }) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuth: false,
      initialized: false,

      setInitialized: () => set({ initialized: true }),

      login: ({ accessToken, user }) => {
        set({
          accessToken,
          user,
          isAuth: true,
        });
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
          isAuth: false,
        });
      },

      setAccessToken: (token) =>
        set({
          accessToken: token,
          isAuth: true,
        }),

      setUser: (user) =>
        set({
          user,
          isAuth: !!user,
        }),
    }),
    {
      name: 'auth-storage', // ключ в localStorage
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuth: state.isAuth,
      }),
    },
  ),
);
