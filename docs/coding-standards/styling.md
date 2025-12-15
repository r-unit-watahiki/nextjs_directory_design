# スタイリング規約

## 基本方針

- Tailwind CSS をメインのスタイリング手法として使用する
- カスタム CSS は必要最小限に留める
- インラインスタイルは避ける

## Tailwind CSS の使い方

### クラス名の記述

```tsx
// Good: Tailwind のユーティリティクラスを使用
export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

// Bad: インラインスタイルは使わない
export function Card({ title, children }: CardProps) {
  return (
    <div style={{ padding: "24px", borderRadius: "8px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>{title}</h2>
    </div>
  );
}
```

### 条件付きクラス名

複数のクラス名を条件付きで適用する場合は `clsx` または `cn` ヘルパーを使用する。

```tsx
import { clsx } from "clsx";

type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", size = "md" }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded font-medium transition-colors",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" &&
          "bg-gray-200 text-gray-900 hover:bg-gray-300",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-base",
        size === "lg" && "px-6 py-3 text-lg"
      )}
    >
      Click me
    </button>
  );
}
```

### レスポンシブデザイン

Tailwind のレスポンシブプレフィックスを使用する。

```tsx
export function Hero() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ... */}
      </div>
    </div>
  );
}
```

## カスタムスタイル

### globals.css

プロジェクト全体で使用するスタイルは `src/app/globals.css` に記述する。

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムベーススタイル */
@layer base {
  html {
    @apply antialiased;
  }
}

/* カスタムコンポーネントスタイル */
@layer components {
  .btn-primary {
    @apply rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700;
  }
}
```

### モジュール CSS

コンポーネント固有のスタイルが必要な場合は CSS Modules を使用する。

```tsx
// Button.module.css
.button {
  display: inline-flex;
  align-items: center;
}

.icon {
  margin-right: 0.5rem;
}
```

```tsx
// Button.tsx
import styles from "./Button.module.css";

export function Button() {
  return (
    <button className={styles.button}>
      <span className={styles.icon}>→</span>
      Click me
    </button>
  );
}
```

## Tailwind の設定カスタマイズ

プロジェクト固有のデザイントークンは `tailwind.config.ts` で定義する。

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          // ...
          900: "#0c4a6e",
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
};

export default config;
```

## ダークモード

ダークモードは Tailwind の `dark:` プレフィックスを使用する。

```tsx
export function Card() {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-bold">Title</h2>
    </div>
  );
}
```

## 注意事項

- 任意の値（`w-[123px]`）の使用は最小限にし、可能な限り定義済みのユーティリティクラスを使用する
- 同じパターンが繰り返される場合は、コンポーネント化または `@layer components` でカスタムクラスを定義する
- `!important` の使用は避ける
