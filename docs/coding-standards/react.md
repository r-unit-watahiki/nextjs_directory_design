# React/Next.js 規約

## コンポーネントの書き方

### 基本原則

- コンポーネントは関数コンポーネントで記述する
- アロー関数ではなく、通常の関数宣言を使用する
- 1 ファイル 1 コンポーネントを原則とする
- コンポーネント名は PascalCase で記述する

```tsx
// Good
export function UserProfile({ userId }: UserProfileProps) {
  return <div>...</div>;
}

// Bad: アロー関数は使わない
export const UserProfile = ({ userId }: UserProfileProps) => {
  return <div>...</div>;
};
```

### Props の定義

- Props は TypeScript の型またはインターフェースで定義する
- Props の型名は `{ComponentName}Props` とする
- オプショナルなプロパティには `?` を使用する

```tsx
type UserProfileProps = {
  userId: string;
  userName: string;
  avatarUrl?: string;
  onUpdate?: (userId: string) => void;
};

export function UserProfile({
  userId,
  userName,
  avatarUrl,
  onUpdate,
}: UserProfileProps) {
  // ...
}
```

### デフォルト Props

- デフォルト値はデストラクチャリングで設定する

```tsx
type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", size = "md" }: ButtonProps) {
  // ...
}
```

## Hooks 使用ルール

### useState

- 状態の初期値は型推論に任せるか、明示的に型を指定する
- 複雑な状態は個別に分割する

```tsx
// Good: 型推論
const [isOpen, setIsOpen] = useState(false);
const [userName, setUserName] = useState("");

// Good: 明示的な型指定が必要な場合
const [user, setUser] = useState<User | null>(null);

// Bad: 関連性のない状態をオブジェクトにまとめない
const [state, setState] = useState({ isOpen: false, userName: "" });
```

### useEffect

- 副作用は適切に分離する
- 依存配列を必ず指定する
- クリーンアップ関数が必要な場合は必ず実装する

```tsx
// Good
useEffect(() => {
  const subscription = api.subscribe(userId);
  return () => subscription.unsubscribe();
}, [userId]);

// Bad: 依存配列の省略
useEffect(() => {
  fetchUser(userId);
}); // 無限ループの原因になる
```

### カスタムフック

- カスタムフックは `use` で始まる名前にする
- 複雑なロジックや再利用可能なロジックをカスタムフックに切り出す
- `src/hooks/` ディレクトリに配置する

```tsx
// src/hooks/useUser.ts
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}
```

## Server Components と Client Components の使い分け

### Server Components（デフォルト）

App Router では、すべてのコンポーネントはデフォルトで Server Components となる。

#### Server Components を使うべき場合

- データフェッチング
- バックエンドリソースへの直接アクセス
- 機密情報の保持（API キー、アクセストークンなど）
- 大きな依存関係をサーバーに保持する場合

```tsx
// app/users/[id]/page.tsx
// Server Component (デフォルト)
export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id); // サーバーサイドで実行
  return <UserProfile user={user} />;
}
```

### Client Components

インタラクティブな機能や状態管理が必要な場合は `'use client'` ディレクティブを使用する。

#### Client Components を使うべき場合

- イベントリスナー（`onClick`、`onChange` など）を使用する場合
- State や Lifecycle Effects（`useState`、`useEffect` など）を使用する場合
- ブラウザ専用 API を使用する場合
- カスタムフックを使用する場合

```tsx
// components/features/user/UserProfileEditor.tsx
"use client";

import { useState } from "react";

type UserProfileEditorProps = {
  user: User;
};

export function UserProfileEditor({ user }: UserProfileEditorProps) {
  const [name, setName] = useState(user.name);

  const handleSubmit = () => {
    // クライアントサイドでのイベント処理
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </form>
  );
}
```

### 使い分けの原則

1. 可能な限り Server Components を使用する
2. インタラクティブな部分のみを Client Components にする
3. Client Components は葉（leaf）に配置し、ツリーの下層に押し下げる

```tsx
// Good: Server Component の中で必要な部分だけ Client Component にする
// app/users/[id]/page.tsx (Server Component)
export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id);

  return (
    <div>
      <UserProfile user={user} /> {/* Server Component */}
      <UserProfileEditor user={user} /> {/* Client Component */}
    </div>
  );
}

// Bad: ページ全体を Client Component にしない
// app/users/[id]/page.tsx
("use client"); // ページ全体をクライアントコンポーネントにするのは避ける

export default function UserPage({ params }: { params: { id: string } }) {
  // ...
}
```

## コンポーネント構成のベストプラクティス

### 条件付きレンダリング

- 早期リターンを活用する
- 複雑な条件は変数に抽出する

```tsx
// Good: 早期リターン
export function UserProfile({ user }: UserProfileProps) {
  if (!user) {
    return <div>ユーザーが見つかりません</div>;
  }

  return <div>{user.name}</div>;
}

// Good: 複雑な条件を変数に抽出
export function Post({ post, currentUser }: PostProps) {
  const canEdit = currentUser?.id === post.authorId;
  const isPublished = post.status === "published";

  return <div>{canEdit && !isPublished && <EditButton />}</div>;
}
```

### リストのレンダリング

- `key` プロパティは必ず指定する
- インデックスを `key` として使用しない（並び順が変わらない場合を除く）

```tsx
// Good
export function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Bad: インデックスをkeyにしない
{
  users.map((user, index) => <li key={index}>{user.name}</li>);
}
```

### イベントハンドラー

- イベントハンドラーには `handle` プレフィックスを使用する
- コールバック props には `on` プレフィックスを使用する

```tsx
type ButtonProps = {
  onClick: () => void; // コールバックprop
};

export function SubmitButton({ onClick }: ButtonProps) {
  const handleClick = () => {
    // 追加の処理
    onClick();
  };

  return <button onClick={handleClick}>送信</button>;
}
```

## パフォーマンスの最適化

### メモ化

必要な場合のみ `useMemo` と `useCallback` を使用する。

```tsx
// Good: 重い計算処理のメモ化
export function DataTable({ data }: DataTableProps) {
  const sortedData = useMemo(() => {
    return data.sort((a, b) => a.value - b.value);
  }, [data]);

  return <table>...</table>;
}

// Good: コールバックのメモ化（子コンポーネントへの安定した参照）
export function Form() {
  const handleSubmit = useCallback((values: FormValues) => {
    submitForm(values);
  }, []);

  return <FormComponent onSubmit={handleSubmit} />;
}
```

### React.memo

Props が変更されない限り再レンダリングを防ぐ。

```tsx
import { memo } from "react";

export const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
}: Props) {
  // 重い処理
  return <div>...</div>;
});
```

## アクセシビリティ

- セマンティックな HTML タグを使用する
- `alt` 属性を必ず指定する
- フォームコントロールには適切なラベルを付ける

```tsx
// Good
export function LoginForm() {
  return (
    <form>
      <label htmlFor="email">メールアドレス</label>
      <input id="email" type="email" name="email" />

      <button type="submit">ログイン</button>
    </form>
  );
}
```
