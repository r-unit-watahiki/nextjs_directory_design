import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * テーマモードの型定義
 */
export type ThemeMode = 'light' | 'dark';

/**
 * カラーパレットの型定義
 */
export interface ColorPalette {
  /** プライマリカラー */
  primary: string;
  /** セカンダリカラー */
  secondary: string;
  /** エラーカラー */
  error: string;
  /** 成功カラー */
  success: string;
  /** 警告カラー */
  warning: string;
  /** 情報カラー */
  info: string;
  /** 背景カラー */
  background: string;
  /** サーフェスカラー（カード背景など） */
  surface: string;
  /** テキストカラー（プライマリ） */
  text: string;
  /** テキストカラー（セカンダリ） */
  textSecondary: string;
  /** ボーダーカラー */
  border: string;
}

/**
 * デフォルトのライトテーマカラーパレット
 */
export const LIGHT_THEME_COLORS: ColorPalette = {
  primary: '#0066BE',
  secondary: '#00A3BF',
  error: '#FF5454',
  success: '#259D63',
  warning: '#FFE380',
  info: '#4D9FFF',
  background: '#FFFFFF',
  surface: '#F2F2F2',
  text: '#1A1A1A',
  textSecondary: '#4D4D4D',
  border: '#B3B3B3',
};

/**
 * デフォルトのダークテーマカラーパレット
 */
export const DARK_THEME_COLORS: ColorPalette = {
  primary: '#4D9FFF',
  secondary: '#33BFD8',
  error: '#FF7070',
  success: '#3FBF7F',
  warning: '#FFE380',
  info: '#70B3FF',
  background: '#1A1A1A',
  surface: '#2D2D2D',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: '#4D4D4D',
};

/**
 * テーマストアの状態と操作の型定義
 */
interface ThemeStore {
  /** 現在のテーマモード */
  mode: ThemeMode;
  /** 現在のカラーパレット */
  colors: ColorPalette;
  /**
   * テーマモードを設定
   * @param mode - 設定するテーマモード
   */
  setMode: (mode: ThemeMode) => void;
  /**
   * テーマモードをトグル（light ⇔ dark）
   */
  toggleMode: () => void;
  /**
   * カラーパレット全体を設定
   * @param colors - 設定するカラーパレット
   */
  setColors: (colors: ColorPalette) => void;
  /**
   * カラーパレットの特定のカラーを更新
   * @param key - 更新するカラーのキー
   * @param value - 新しいカラー値
   */
  updateColor: <K extends keyof ColorPalette>(key: K, value: ColorPalette[K]) => void;
  /**
   * デフォルトのカラーパレットにリセット
   */
  resetColors: () => void;
}

/**
 * テーマ状態を管理するZustandストア
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'light',
      colors: LIGHT_THEME_COLORS,

      setMode: (mode) =>
        set({
          mode,
          colors: mode === 'light' ? LIGHT_THEME_COLORS : DARK_THEME_COLORS,
        }),

      toggleMode: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({
          mode: newMode,
          colors: newMode === 'light' ? LIGHT_THEME_COLORS : DARK_THEME_COLORS,
        });
      },

      setColors: (colors) => set({ colors }),

      updateColor: (key, value) =>
        set((state) => ({
          colors: {
            ...state.colors,
            [key]: value,
          },
        })),

      resetColors: () =>
        set((state) => ({
          colors: state.mode === 'light' ? LIGHT_THEME_COLORS : DARK_THEME_COLORS,
        })),
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        mode: state.mode,
        colors: state.colors,
      }),
    },
  ),
);
