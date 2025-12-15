import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * ユーザー情報の型定義
 */
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
}

/**
 * 認証ストアの状態と操作の型定義
 */
interface AuthState {
  /** 現在ログイン中のユーザー情報 */
  user: User | null;
  /** 認証状態 */
  isAuthenticated: boolean;
  /** ローディング状態 */
  isLoading: boolean;
  /**
   * ユーザーログイン処理
   * @param user - ログインするユーザー情報
   */
  login: (user: User) => void;
  /**
   * ユーザーログアウト処理
   */
  logout: () => void;
  /**
   * ローディング状態を設定
   * @param loading - ローディング状態
   */
  setLoading: (loading: boolean) => void;
}

/**
 * 認証状態を管理するZustandストア
 *
 * @example
 * ```tsx
 * import { useAuthStore } from '@/shared/stores/useAuthStore';
 *
 * function LoginButton() {
 *   const login = useAuthStore((state) => state.login);
 *   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
 *
 *   const handleLogin = () => {
 *     login({
 *       id: '1',
 *       name: 'John Doe',
 *       email: 'john@example.com',
 *       role: 'user'
 *     });
 *   };
 *
 *   return <button onClick={handleLogin}>Login</button>;
 * }
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
      setLoading: (loading: boolean) =>
        set({
          isLoading: loading,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
