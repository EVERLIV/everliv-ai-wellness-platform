
import { User, Session } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithMagicLink: (email: string) => Promise<void>;
  signUpWithMagicLink: (email: string, userData: { nickname: string }) => Promise<void>;
  signOut: () => Promise<void>;
  // Методы для совместимости со старыми страницами
  resetPassword: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
};

export type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
};
