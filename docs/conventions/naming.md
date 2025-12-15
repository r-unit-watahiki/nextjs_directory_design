# 命名規則

このドキュメントでは、ファイル名、ディレクトリ名、およびコード内の命名ルールについて定義します。

## 目次

- [ファイル命名規則](#ファイル命名規則)
- [ディレクトリ命名規則](#ディレクトリ命名規則)
- [コード命名規則](#コード命名規則)

---

## ファイル命名規則

### 基本原則

- **一貫性**: プロジェクト全体で同じルールを適用
- **明確性**: ファイルの内容が名前から推測できる
- **簡潔性**: 必要以上に長い名前は避ける

### Next.js 特別なファイル

Next.js App Router の特別なファイルは、規定の名前を使用します。

```
page.tsx          # ページコンポーネント
layout.tsx        # レイアウトコンポーネント
loading.tsx       # ローディングUI
error.tsx         # エラーハンドリング
not-found.tsx     # 404ページ
route.ts          # APIルート
template.tsx      # テンプレート
default.tsx       # フォールバックUI
proxy.ts          # ミドルウェア
```

**参考**: [Next.js File Conventions](https://nextjs.org/docs/app/building-your-application/routing)

### TypeScript 特別なファイル

TypeScript/JavaScript のモジュールシステムで使用される特別なファイルです。

```
index.ts          # エクスポートの集約
```

**使用例:**

```typescript
// features/authentication/components/index.ts
export { LoginForm } from "./LoginForm";
export { SignupForm } from "./SignupForm";
export { PasswordResetForm } from "./PasswordResetForm";

// 使用側
import { LoginForm, SignupForm } from "@/features/authentication/components";
```

**理由:**

- ディレクトリからのインポートを簡潔にする
- 内部構造の変更を吸収できる
- エクスポートする要素を明示的に管理できる

**注意:**

- すべてのディレクトリに index.ts を作る必要はない
- 複数のファイルをまとめてエクスポートする場合のみ使用
- App Router のルートディレクトリには作成しない（Next.js の特別なファイルと競合する可能性）

### React コンポーネント

**パスカルケース (PascalCase)** を使用します。

```
UserProfile.tsx
BlogPost.tsx
NavigationMenu.tsx
SearchInput.tsx
ProductCard.tsx
```

**理由:**

- React コンポーネントは慣習的にパスカルケースを使用
- JSX 内で `<UserProfile />` のように使用するため、大文字開始が必須
- ファイル名とコンポーネント名を一致させることで可読性が向上

**例:**

```typescript
// Good: ファイル名とコンポーネント名が一致
// UserProfile.tsx
export function UserProfile() {
  return <div>User Profile</div>;
}

// Bad: ファイル名とコンポーネント名が不一致
// user-profile.tsx
export function UserProfile() {
  return <div>User Profile</div>;
}
```

### カスタムフック

**`use` プレフィックス + キャメルケース (camelCase)** を使用します。

```
useAuth.ts
useLocalStorage.ts
useDebounce.ts
useFetchData.ts
useMediaQuery.ts
```

**理由:**

- React のフック規約に準拠
- `use` プレフィックスにより、フックであることが明確
- React の linter が正しく動作する

**例:**

```typescript
// Good
// useAuth.ts
export function useAuth() {
  // フックの実装
}

// Bad
// auth.ts
export function auth() {
  // フックの実装
}
```

### Zustand Store

**`use` プレフィックス + パスカルケース + `Store` サフィックス** を使用します。

```
useAuthStore.ts
useCartStore.ts
useUserPreferencesStore.ts
useNotificationStore.ts
useThemeStore.ts
```

**理由:**

- フックとして使用するため `use` プレフィックスを付与
- ストアであることを明示するため `Store` サフィックスを付与
- グローバルな状態管理であることが一目で分かる
- カスタムフックと区別しやすい

**例:**

```typescript
// Good
// useAuthStore.ts
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Bad
// authStore.ts または auth-store.ts
export const authStore = create((set) => ({
  // ...
}));
```

### ユーティリティ・ヘルパー関数

**ケバブケース (kebab-case)** を使用します。

```
api-client.ts
format-date.ts
validate-email.ts
calculate-total.ts
parse-query-string.ts
```

**理由:**

- ファイルシステムで読みやすい
- URL やパッケージ名との親和性が高い
- 小文字のみのため、大文字小文字を区別しないファイルシステムでも安全

**例:**

```typescript
// Good
// format-date.ts
export function formatDate(date: Date): string {
  // 実装
}

// Bad
// formatDate.ts または format_date.ts
export function formatDate(date: Date): string {
  // 実装
}
```

### 型定義ファイル

**ケバブケース (kebab-case)** を使用します。

```
# 複数の型をまとめる場合: -types (複数形)
user-types.ts
api-types.ts
product-types.ts
form-types.ts

# 単一の型の場合: -type (単数形)
user-type.ts
product-type.ts
api-response-type.ts
```

**理由:**

- ファイル命名規則を統一し、一貫性を保つ
- ケバブケースは他のファイル名との統一感がある
- `-type` / `-types` サフィックスで型定義ファイルであることが明確
- 単数形/複数形を使い分けることで、ファイルの内容が推測しやすい

### 定数ファイル

**小文字のケバブケース** を使用します。

```
constants.ts
app-config.ts
api-endpoints.ts
validation-rules.ts
```

**理由:**

- ファイル名は小文字で統一
- コード内の定数は大文字のスネークケースを使用

### Storybook ファイル

元のファイル名に `.stories` を付与します。

```
UserProfile.stories.tsx
Button.stories.tsx
Input.stories.tsx
```

---

## ディレクトリ命名規則

### 基本原則

**すべてのディレクトリはケバブケース (kebab-case)** を使用します。

```
user-profile/
blog-post/
shopping-cart/
account-settings/
```

**理由:**

- URL パスに直接マッピングされる（App Router の場合）
- SEO フレンドリー
- Web 標準に準拠
- 小文字のみのため、OS 間での互換性が高い

### App Router のルート

```
app/
├── user-profile/           # /user-profile
├── blog-post/              # /blog-post
│   └── [id]/               # /blog-post/123
├── settings/               # /settings
│   └── account-settings/   # /settings/account-settings
└── api/
    └── user-data/          # /api/user-data
```

### 機能ディレクトリ（features）

```
features/
├── authentication/
├── user-management/
├── blog-post/
├── shopping-cart/
└── notification/
```

### その他のディレクトリ

```
components/
├── shared/
└── layout/

hooks/
lib/
utils/
types/
constants/
styles/
```

**注意事項:**

- ルートディレクトリ内でのアンダースコア `_` の使用は、プライベートフォルダを示す Next.js の規約のみで使用
- それ以外ではアンダースコアは使用しない

```
app/
├── _components/     # OK: プライベートフォルダ（ルーティング対象外）
├── user-profile/    # OK: 通常のルート
└── api_v2/          # Bad: アンダースコアは使用しない
```

---

## コード命名規則

### コンポーネント

**パスカルケース (PascalCase)** を使用します。

```typescript
// Good
export function UserProfile() {}
export function BlogPost({ title }: { title: string }) {}

// Bad
export function userProfile() {}
export const blog_post = () => {};
```

### 関数

**キャメルケース (camelCase)** を使用します。

```typescript
// Good
function fetchUserData() {}
const calculateTotal = () => {};
async function submitForm() {}

// Bad
function FetchUserData() {}
const calculate_total = () => {};
```

### 変数

**キャメルケース (camelCase)** を使用します。

```typescript
// Good
const userName = "John";
let itemCount = 0;
const isAuthenticated = true;

// Bad
const user_name = "John";
let ItemCount = 0;
const is_authenticated = true;
```

### 定数

**大文字のスネークケース (UPPER_SNAKE_CASE)** を使用します。

```typescript
// Good
const API_BASE_URL = "https://api.example.com";
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 5000;

// Bad
const apiBaseUrl = "https://api.example.com";
const maxRetryCount = 3;
```

**注意:**

- 真の定数（変更されない値）のみ大文字のスネークケースを使用
- 設定値や環境変数など
- `const` だからといってすべて大文字にする必要はない

```typescript
// Good: 真の定数
const API_VERSION = "v1";
const HTTP_STATUS_OK = 200;

// Good: 通常の変数
const userList = getUsers();
const totalPrice = calculatePrice();

// Bad: 過剰な大文字使用
const USER_LIST = getUsers();
const TOTAL_PRICE = calculatePrice();
```

### 型・インターフェース

**パスカルケース (PascalCase)** を使用します。

```typescript
// Good
type User = {
  id: string;
  name: string;
};

interface UserProfile {
  user: User;
  bio: string;
}

type ApiResponse<T> = {
  data: T;
  error?: string;
};

// Bad
type user = {};
interface user_profile {}
type apiResponse<T> = {};
```

**インターフェース vs Type:**

- プロジェクト全体で一貫性を保つ
- 拡張が必要な場合は `interface` を優先
- ユニオン型などが必要な場合は `type` を使用

### Enum

**パスカルケース (PascalCase)** を使用します。

```typescript
// Good
enum UserRole {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}

enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  NotFound = 404,
}

// Bad
enum user_role {
  admin = "admin",
  user = "user",
}

enum HTTP_STATUS {
  ok = 200,
}
```

**注意:**

- TypeScript では `const enum` や `as const` の使用も検討
- 文字列リテラル型で十分な場合も多い

```typescript
// 代替案: 文字列リテラル型
type UserRole = "admin" | "user" | "guest";

// 代替案: as const
const UserRole = {
  Admin: "admin",
  User: "user",
  Guest: "guest",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];
```

### ブール値

`is`, `has`, `should`, `can` などのプレフィックスを使用します。

```typescript
// Good
const isAuthenticated = true;
const hasPermission = false;
const shouldRender = true;
const canEdit = false;

// Bad
const authenticated = true;
const permission = false;
const render = true;
```

### 配列

複数形を使用します。

```typescript
// Good
const users = [user1, user2];
const items = getItems();
const blogPosts = [];

// Bad
const userList = [user1, user2];
const itemArray = getItems();
```

### イベントハンドラー

`handle` または `on` プレフィックスを使用します。

```typescript
// Good
const handleClick = () => {};
const handleSubmit = async () => {};
const onUserLogin = (user: User) => {};

// Bad
const click = () => {};
const submit = () => {};
const userLogin = () => {};
```

**慣習:**

- コンポーネント内: `handle` プレフィックス
- Props として渡す: `on` プレフィックス

```typescript
// Good
function LoginForm({ onSubmit }: { onSubmit: () => void }) {
  const handleSubmit = () => {
    // バリデーション処理
    onSubmit();
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 実践例

### ディレクトリとファイルの命名例

```
app/
├── user-profile/              # ルート（ケバブケース）
│   ├── page.tsx              # 特別なファイル
│   └── loading.tsx
├── blog-post/
│   ├── [id]/
│   │   └── page.tsx
│   └── page.tsx

features/
└── authentication/
    ├── components/
    │   ├── LoginForm.tsx      # コンポーネント（パスカルケース）
    │   └── SignupForm.tsx
    ├── hooks/
    │   └── useAuth.ts         # フック（use + キャメル）
    ├── stores/
    │   └── useAuthStore.ts    # ストア（use + パスカル + Store）
    ├── lib/
    │   ├── api-client.ts      # ユーティリティ（ケバブケース）
    │   └── validate-email.ts
    └── types/
        └── auth-types.ts      # 型定義（ケバブケース + types）

lib/
├── api-client.ts
├── format-date.ts
└── constants.ts

types/
├── user-types.ts
└── api-types.ts
```

### コード命名の例

```typescript
// useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    // ログイン処理
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
```

```typescript
// useAuth.ts
import { useEffect } from "react";
import { useAuthStore } from "@/features/authentication/stores/useAuthStore";

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    // 認証状態の初期化
  }, []);

  return { user, isAuthenticated, login, logout };
}
```

```typescript
// UserProfile.tsx
import { useAuth } from "@/features/authentication/hooks/useAuth";

export function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return <div>ログインしてください</div>;
  }

  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
}
```

```typescript
// constants.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
```

```typescript
// format-date.ts
export function formatDate(date: Date, format: string = "YYYY-MM-DD"): string {
  // 実装
}

export function getRelativeTime(date: Date): string {
  // 実装
}
```

---

## チェックリスト

新しいファイルやコードを作成する際は、以下を確認してください。

### ファイル命名

- [ ] Next.js 特別なファイルは規定の名前を使用している
- [ ] React コンポーネントはパスカルケースになっている
- [ ] カスタムフックは `use` で始まるキャメルケースになっている
- [ ] Zustand ストアは `useXXXStore` という命名になっている
- [ ] ユーティリティファイルはケバブケースになっている

### ディレクトリ命名

- [ ] すべてのディレクトリがケバブケースになっている
- [ ] URL パスと一致している（App Router の場合）
- [ ] プライベートフォルダは `_` プレフィックスを使用している

### コード命名

- [ ] コンポーネント名はパスカルケースになっている
- [ ] 関数名はキャメルケースになっている
- [ ] 変数名はキャメルケースになっている
- [ ] 定数は大文字のスネークケースになっている
- [ ] 型・インターフェースはパスカルケースになっている
- [ ] ブール値には適切なプレフィックス（`is`, `has` など）が付いている
- [ ] イベントハンドラーには `handle` または `on` プレフィックスが付いている

---

## 参考資料

- [Next.js File Conventions](https://nextjs.org/docs/app/building-your-application/routing)
- [React Naming Conventions](https://react.dev/learn)
- [TypeScript Style Guide](https://typescript-eslint.io/rules/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
