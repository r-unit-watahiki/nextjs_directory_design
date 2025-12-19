# 使用ライブラリ

このドキュメントでは、プロジェクトで使用する/推奨されるライブラリとその用途について説明します。

## 目次

- [コアライブラリ](#コアライブラリ)
- [状態管理](#状態管理)
- [フォーム管理](#フォーム管理)
- [バリデーション](#バリデーション)
- [スタイリング](#スタイリング)
- [ユーティリティ](#ユーティリティ)
- [開発ツール](#開発ツール)
- [推奨ライブラリ](#推奨ライブラリ)

---

## コアライブラリ

### Next.js

**バージョン**: `16.0.8`
**用途**: React フレームワーク、ルーティング、SSR/SSG

```json
{
  "dependencies": {
    "next": "16.0.8"
  }
}
```

**特徴**:

- App Router によるファイルベースルーティング
- Server Components によるパフォーマンス最適化
- 画像最適化、フォント最適化
- API Routes

**ドキュメント**: [Next.js Documentation](https://nextjs.org/docs)

### React

**バージョン**: `19.2.1`
**用途**: UI ライブラリ

```json
{
  "dependencies": {
    "react": "19.2.1",
    "react-dom": "19.2.1"
  }
}
```

**特徴**:

- コンポーネントベースの UI 構築
- Hooks による状態管理とロジックの再利用
- Server Components のサポート

**ドキュメント**: [React Documentation](https://react.dev)

### TypeScript

**バージョン**: `^5`
**用途**: 型安全性の確保

```json
{
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19"
  }
}
```

**特徴**:

- 静的型チェック
- IDE サポートの向上
- コードの可読性とメンテナンス性の向上

**ドキュメント**: [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## 状態管理

### Zustand

**バージョン**: `^5.0.9`
**用途**: グローバル状態管理

```json
{
  "dependencies": {
    "zustand": "^5.0.9"
  }
}
```

**使用場面**:

- 複数のコンポーネントで共有する状態
- アプリケーション全体で永続化する必要がある状態
- コンポーネントツリーを超えて状態を共有する場合

**使用例**:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
);
```

**ドキュメント**: [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)

**詳細**: [状態管理ガイド](./state-management.md)

---

## フォーム管理

### React Hook Form

**バージョン**: 未インストール（推奨）
**用途**: フォーム状態管理とバリデーション

```bash
npm install react-hook-form
```

**特徴**:

- パフォーマンスに優れた（不要な再レンダリングを最小化）
- TypeScript との統合
- Zod などのバリデーションライブラリとの連携
- 少ないボイラープレート

**使用例**:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // フォーム送信処理
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
    </form>
  );
}
```

**ドキュメント**: [React Hook Form Documentation](https://react-hook-form.com)

**詳細**: [状態管理ガイド - フォーム状態管理](./state-management.md#フォーム状態管理)

---

## バリデーション

### Zod

**バージョン**: 未インストール（推奨）
**用途**: スキーマ定義とバリデーション

```bash
npm install zod
npm install @hookform/resolvers  # React Hook Form と併用する場合
```

**特徴**:

- TypeScript ファーストのスキーマ定義
- 型推論によるタイプセーフ
- サーバーサイドとクライアントサイドで共有可能
- 詳細なエラーメッセージ

**使用例**:

```typescript
import { z } from "zod";

// スキーマ定義
export const contactSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  message: z.string().min(1).max(500),
});

// 型を自動生成
export type ContactFormData = z.infer<typeof contactSchema>;

// バリデーション
const result = contactSchema.safeParse(data);
if (!result.success) {
  console.log(result.error.errors);
}
```

**ドキュメント**: [Zod Documentation](https://zod.dev)

**詳細**: [状態管理ガイド - フォーム状態管理](./state-management.md#フォーム状態管理)

---

## スタイリング

### Tailwind CSS

**バージョン**: `^4`
**用途**: ユーティリティファーストの CSS フレームワーク

```json
{
  "devDependencies": {
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4"
  }
}
```

**特徴**:

- ユーティリティクラスによる高速開発
- レスポンシブデザインのサポート
- ダークモードのサポート
- カスタマイズ可能なデザインシステム

**使用例**:

```tsx
export function Card({ title }: CardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  );
}
```

**ドキュメント**: [Tailwind CSS Documentation](https://tailwindcss.com/docs)

**詳細**: [スタイリング規約](../coding-standards/styling.md)

### clsx

**バージョン**: 未インストール（推奨）
**用途**: 条件付きクラス名の結合

```bash
npm install clsx
```

**特徴**:

- 軽量（約 200 バイト）
- 条件付きクラス名の簡潔な記述
- TypeScript サポート

**使用例**:

```typescript
import { clsx } from "clsx";

export function Button({ variant = "primary", size = "md" }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded font-medium transition-colors",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" &&
          "bg-gray-200 text-gray-900 hover:bg-gray-300",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-base"
      )}
    >
      Click me
    </button>
  );
}
```

**ドキュメント**: [clsx on GitHub](https://github.com/lukeed/clsx)

---

## ユーティリティ

### date-fns

**バージョン**: 未インストール（推奨）
**用途**: 日付操作ライブラリ

```bash
npm install date-fns
```

**特徴**:

- モジュラー設計（必要な関数のみインポート）
- TypeScript サポート
- 不変性（元のデータを変更しない）
- 国際化サポート

**使用例**:

```typescript
import { format, parseISO, isAfter } from "date-fns";
import { ja } from "date-fns/locale";

const formatted = format(new Date(), "yyyy年MM月dd日", { locale: ja });
// => "2025年12月17日"

const date = parseISO("2025-12-17");
const isFuture = isAfter(date, new Date());
```

**ドキュメント**: [date-fns Documentation](https://date-fns.org)

### es-toolkit

**バージョン**: 未インストール（推奨）
**用途**: 高性能ユーティリティ関数ライブラリ

```bash
npm install es-toolkit
```

**特徴**:

- **高パフォーマンス**: Lodash と比較して 2〜3 倍高速
- **小さいバンドルサイズ**: 他のライブラリと比較して最大 97% 小さい JavaScript コード
- **モダンな実装**: 最新の JavaScript API を活用
- **Lodash 互換性**: 完全な互換性レイヤーを提供
- **型安全性**: すべての関数で堅牢な TypeScript 型を提供
- **100% テストカバレッジ**: 高い信頼性
- **全ランタイム対応**: Node.js、Deno、Bun、ブラウザをサポート

**使用例**:

```typescript
import { debounce, groupBy, uniqBy } from "es-toolkit";

// デバウンス
const debouncedSearch = debounce((query: string) => {
  search(query);
}, 300);

// グループ化
const grouped = groupBy(users, (user) => user.role);

// 重複排除
const unique = uniqBy(users, (user) => user.id);
```

**Lodash からの移行**:

```typescript
// 互換性レイヤーを使用する場合
import { debounce, groupBy, uniqBy } from "es-toolkit/compat";

// Lodash と同じ API で使用可能
const grouped = groupBy(users, "role");
const unique = uniqBy(users, "id");
```

**注意**: ネイティブの JavaScript メソッドで代替できる場合は、そちらを優先してください。

**ドキュメント**: [es-toolkit Documentation](https://es-toolkit.dev)

---

## 開発ツール

### Biome

**バージョン**: `2.2.0`
**用途**: リンター・フォーマッター

```json
{
  "devDependencies": {
    "@biomejs/biome": "2.2.0"
  }
}
```

**特徴**:

- ESLint と Prettier の代替
- 高速な実行速度
- TypeScript/JavaScript のサポート
- 設定ファイルがシンプル

**スクリプト**:

```json
{
  "scripts": {
    "lint:biome": "biome check",
    "lint:biome:fix": "biome check --write",
    "format": "biome format --write"
  }
}
```

**ドキュメント**: [Biome Documentation](https://biomejs.dev)

**詳細**: [Biome 設定ガイド](../coding-standards/biome-configuration.md)

### ls-lint

**バージョン**: `^2.3.1`
**用途**: ファイル名・ディレクトリ名のリント

```json
{
  "devDependencies": {
    "@ls-lint/ls-lint": "^2.3.1"
  }
}
```

**特徴**:

- 命名規則の強制
- 高速な実行速度
- カスタマイズ可能なルール

**スクリプト**:

```json
{
  "scripts": {
    "lint:ls": "ls-lint"
  }
}
```

**ドキュメント**: [ls-lint Documentation](https://ls-lint.org)

**詳細**: [命名規則ガイド](../conventions/naming.md)

---

## 推奨ライブラリ

以下は、プロジェクトの要件に応じて追加を検討すべきライブラリです。

### データフェッチング

#### Next.js Fetch API

**バージョン**: Next.js 組み込み
**用途**: データフェッチング、キャッシング

**特徴**:

- Next.js が拡張した fetch API
- 自動的なリクエストのメモ化
- キャッシュとリバリデーション機能
- Server Components と統合

**使用例**:

```typescript
// Server Component でのデータフェッチング
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    next: { revalidate: 3600 }, // 1時間ごとに再検証
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  return <div>{user.name}</div>;
}
```

**ドキュメント**: [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

### UI コンポーネント

このプロジェクトでは Tailwind CSS を使用してカスタムコンポーネントを実装することを推奨しています。

コンポーネントライブラリ（Material-UI、Chakra UI など）は、以下の理由から原則として使用しません:

- Tailwind CSS でカスタマイズ可能なコンポーネントを自作することで、デザインの一貫性を保つ
- バンドルサイズの削減
- プロジェクト固有のデザインシステムの構築

ただし、必要に応じて以下のような軽量なヘッドレス UI ライブラリの使用は検討できます:

- **Radix UI**: アクセシビリティを重視したヘッドレスコンポーネント
- **Headless UI**: Tailwind CSS との統合に最適化されたヘッドレスコンポーネント
- **shadcn/ui**: Radix UI と Tailwind CSS を組み合わせた再利用可能なコンポーネント集

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
