import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  customRole?: { permissions: string[] };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) => set({ user, token: token || null, isAuthenticated: !!user }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
