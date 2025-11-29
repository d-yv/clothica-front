import { create } from "zustand";
import type { User } from "@/lib/api";

// type User = {
//   id: string;
//   email: string;
//   name?: string;
//   firstName?: string;
//   lastName?: string;
// };

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setUser: (userData: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  // 👇 використовується твоїм фронтом вже зараз
  login: (userData, token) => {
    set({
      user: userData,
      token,
      isAuthenticated: true,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  },

  // 👇 однаковий logout тепер для хедера та кабінету
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // 👇 з нового store — з'єднано зі старим
  setUser: (userData) => {
    set({
      user: userData,
      isAuthenticated: !!userData,
    });

    if (typeof window !== "undefined") {
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("user");
      }
    }
  },
}));