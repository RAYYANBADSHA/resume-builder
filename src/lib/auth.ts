import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (username: string, email: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: (username: string, email: string) => {
        const user = {
          id: Date.now().toString(),
          username,
          email,
        };
        set({ user, isAuthenticated: true });
      },
      signOut: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
