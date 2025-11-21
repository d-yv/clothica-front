// src/lib/store/authStore.ts

import { create } from 'zustand';

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setUser: (userData: User) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (userData, token) => {
    set({
      user: userData,
      token,
      isAuthenticated: true,
    });
    // Сохраняем токен в localStorage для persist
    localStorage.setItem('token', token);
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('token');
  },

  setUser: (userData) => {
    set({ user: userData });
  },
}));
