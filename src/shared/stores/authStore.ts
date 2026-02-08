import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/entities/user/types';

interface AuthState {
  user: User | null;
  token: string | null; 
  isAuthenticated: boolean;
  login: (user: User, token: string) => void; 
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      setUser: (user) => set({ user }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getAuthorizedUser = (): User => {
  const { user } = useAuthStore.getState();
  
  if (!user) {
    throw new Error("Unauthorized: User is not logged in.");
  }
  
  return user;
};

export const getAuthToken = (): string | null => {
  return useAuthStore.getState().token;
};
