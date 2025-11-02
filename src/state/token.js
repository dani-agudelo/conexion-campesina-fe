import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useToken = create(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token: token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'token', 
    }
  )
);
