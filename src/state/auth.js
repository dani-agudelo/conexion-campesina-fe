import { create } from 'zustand';

export const useAuth = create((set) => ({
    currentUser: undefined,
    setCurrentUser: (user) => set({ currentUser: user }),
    clearUser: () => set({ currentUser: undefined })
}))
