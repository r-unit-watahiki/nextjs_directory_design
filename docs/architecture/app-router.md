# App Router

このドキュメントでは、Next.js App Router の使い方とルーティング規約について説明します。

## 目次

- [App Router とは](#app-router-とは)
- [基本的なファイル構成](#基本的なファイル構成)
- [ルーティング規約](#ルーティング規約)
- [Route Groups（ルートグループ）](#route-groupsルートグループ)
- [プライベートフォルダ](#プライベートフォルダ)
- [特別なファイル](#特別なファイル)
- [レイアウトとネスト](#レイアウトとネスト)
- [ページ固有のコンポーネント](#ページ固有のコンポーネント)
- [ベストプラクティス](#ベストプラクティス)

---

## App Router とは

App Router は Next.js 13 で導入された新しいルーティングシステムです。`app` ディレクトリを使用してルーティングを定義します。

### Pages Router との違い

| 特徴              | Pages Router            | App Router             |
| ----------------- | ----------------------- | ---------------------- |
| ディレクトリ      | `pages/`                | `app/`                 |
| ルーティング方式  | ファイルベース          | フォルダベース         |
| レイアウト        | `_app.tsx` のみ         | ネストしたレイアウト   |
| Server Components | 非対応                  | 標準対応               |
| データ取得        | `getServerSideProps` 等 | `async/await` 直接使用 |

### App Router のメリット

1. **Server Components がデフォルト**: パフォーマンスと SEO 向上
2. **ネストしたレイアウト**: ページグループごとに異なるレイアウトを適用可能
3. **コロケーション**: コンポーネントとルートを同じディレクトリに配置可能
4. **並列ルーティング**: 複数のページを同時にレンダリング可能
5. **ストリーミング**: Suspense によるストリーミング SSR

---

## 基本的なファイル構成

このプロジェクトの `app/` ディレクトリの構成例です。

```
app/
├── layout.tsx                      # ルートレイアウト（全ページ共通）
├── page.tsx                        # トップページ（/）
├── loading.tsx                     # グローバルローディング
├── error.tsx                       # グローバルエラー
├── not-found.tsx                   # 404ページ
├── globals.css                     # グローバルスタイル
│
├── (public)/                       # 公開ページグループ
│   ├── layout.tsx                  # 公開ページ用レイアウト
│   ├── login/
│   │   └── page.tsx                # /login
│   └── register/
│       └── page.tsx                # /register
│
├── (private)/                      # 認証が必要なページグループ
│   ├── layout.tsx                  # プライベートページ用レイアウト
│   ├── _components/                # プライベートページ共有コンポーネント
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── page.tsx                    # /（認証後のホーム）
│   ├── messages/
│   │   ├── _components/            # メッセージページ専用コンポーネント
│   │   └── page.tsx                # /messages
│   ├── recruitment/
│   │   ├── _components/
│   │   ├── page.tsx                # /recruitment
│   │   └── [id]/
│   │       └── page.tsx            # /recruitment/[id]
│   └── shifts/
│       ├── daily/
│       │   ├── _components/
│       │   └── page.tsx            # /shifts/daily
│       └── weekly/
│           ├── _components/
│           └── page.tsx            # /shifts/weekly
│
└── api/                            # API Routes
    ├── auth/
    │   └── route.ts                # /api/auth
    └── users/
        └── route.ts                # /api/users
```

---

## ルーティング規約

### フォルダベースルーティング

App Router では、フォルダ構造がそのまま URL 構造になります。

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/
│       └── page.tsx      → /blog/:slug
└── settings/
    ├── profile/
    │   └── page.tsx      → /settings/profile
    └── account/
        └── page.tsx      → /settings/account
```

### ルーティングファイルの優先順位

同じディレクトリ内で、以下の優先順位でファイルが評価されます。

1. `layout.tsx` - レイアウト（ネストされる）
2. `page.tsx` - ページ（そのルートの UI）
3. `loading.tsx` - ローディング UI（Suspense ラッパー）
4. `error.tsx` - エラー UI（Error Boundary ラッパー）
5. `not-found.tsx` - 404 UI

---

## Route Groups（ルートグループ）

### Route Groups とは

Route Groups は、フォルダをグループ化しながら URL パスには影響を与えない機能です。フォルダ名を `(フォルダ名)` のように括弧で囲みます。

### 使用例

```
app/
├── (public)/
│   ├── login/page.tsx       → /login       （/public/loginではない）
│   └── register/page.tsx    → /register
│
└── (private)/
    ├── dashboard/page.tsx   → /dashboard   （/private/dashboardではない）
    └── settings/page.tsx    → /settings
```

### Route Groups のメリット

1. **論理的なグループ化**: 認証の有無、ユーザーロールなどでページをグループ化
2. **レイアウトの分離**: グループごとに異なるレイアウトを適用
3. **コードの整理**: 関連するページを同じディレクトリに配置

### このプロジェクトでの使用例

```typescript
// app/(public)/layout.tsx
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 公開ページ用のシンプルなレイアウト */}
      {children}
    </div>
  );
}

// app/(private)/layout.tsx
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証チェック
  // const session = await getSession();
  // if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### 複数の Route Groups

同じ階層に複数の Route Groups を作成できます。

```
app/
├── (marketing)/
│   ├── layout.tsx
│   ├── about/page.tsx       → /about
│   └── contact/page.tsx     → /contact
│
├── (app)/
│   ├── layout.tsx
│   ├── dashboard/page.tsx   → /dashboard
│   └── settings/page.tsx    → /settings
│
└── (admin)/
    ├── layout.tsx
    ├── users/page.tsx       → /users
    └── reports/page.tsx     → /reports
```

---

## プライベートフォルダ

### プライベートフォルダとは

`_` プレフィックスを付けたフォルダは、Next.js のルーティング対象外になります。

### 使用例

```
app/
├── _components/              # ルーティング対象外
│   ├── Header.tsx
│   └── Footer.tsx
├── _utils/                   # ルーティング対象外
│   └── format-date.ts
├── dashboard/                # /dashboard（ルーティング対象）
│   ├── _components/          # ルーティング対象外
│   │   └── DashboardCard.tsx
│   └── page.tsx
└── settings/                 # /settings（ルーティング対象）
    └── page.tsx
```

### プライベートフォルダの用途

1. **共有コンポーネント**: そのルート内でのみ使用するコンポーネント
2. **ユーティリティ**: ページ固有のヘルパー関数
3. **テストファイル**: コロケーションしたテストファイル
4. **内部モジュール**: ルーティングに含めたくないコード

### ルール

- `_components/` は慣習的にコンポーネント用
- `_utils/`, `_lib/`, `_helpers/` など任意の名前が使用可能
- ネストも可能: `dashboard/_components/_shared/`

---

## 特別なファイル

App Router には、特定の機能を持つ特別なファイルがあります。

### page.tsx

そのルートの UI を定義します。

```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Dashboard</h1>;
}
```

### layout.tsx

複数のページで共有されるレイアウトを定義します。

```typescript
// app/layout.tsx - ルートレイアウト（必須）
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

// app/dashboard/layout.tsx - ネストしたレイアウト
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DashboardNav />
      {children}
    </div>
  );
}
```

### loading.tsx

ローディング状態の UI を定義します（React Suspense を自動的にラップ）。

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

### error.tsx

エラー時の UI を定義します（Error Boundary を自動的にラップ）。

```typescript
// app/dashboard/error.tsx
"use client"; // Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### not-found.tsx

404 エラー時の UI を定義します。

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
```

### route.ts

API Routes を定義します。

```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await fetchUsers();
  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await createUser(body);
  return Response.json(user);
}
```

### 特別なファイルの優先順位

同じディレクトリ内で以下の順序で評価されます。

```
app/dashboard/
├── layout.tsx        # 1. レイアウト適用
├── loading.tsx       # 2. Suspense でラップ
├── error.tsx         # 3. Error Boundary でラップ
├── not-found.tsx     # 4. 404 時に表示
└── page.tsx          # 5. 最終的な UI
```

---

## レイアウトとネスト

### レイアウトのネスト

App Router では、複数のレイアウトをネストできます。

```
app/
├── layout.tsx              # ルートレイアウト
├── (private)/
│   ├── layout.tsx          # プライベートページ用レイアウト
│   └── dashboard/
│       ├── layout.tsx      # ダッシュボード用レイアウト
│       └── page.tsx
```

レンダリング結果:

```tsx
<RootLayout>
  <PrivateLayout>
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  </PrivateLayout>
</RootLayout>
```

### ルートレイアウト（必須）

`app/layout.tsx` は必須で、`<html>` と `<body>` タグを含める必要があります。

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "アプリ名",
  description: "アプリの説明",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

### レイアウトの特徴

1. **状態の保持**: レイアウトは再レンダリングされず、状態が保持される
2. **共有 UI**: ヘッダー、サイドバー、フッターなどの共通 UI を定義
3. **メタデータ**: `metadata` エクスポートで SEO 設定可能

---

## ページ固有のコンポーネント

### 配置ルール

ページ固有のコンポーネントは `_components/` ディレクトリに配置します。

```
app/
├── (private)/
│   ├── _components/              # プライベートページ全体で共有
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── messages/
│   │   ├── _components/          # メッセージページ専用
│   │   │   ├── MessageList.tsx
│   │   │   └── MessageForm.tsx
│   │   └── page.tsx
│   └── recruitment/
│       ├── _components/          # 求人ページ専用
│       │   ├── RecruitmentList.tsx
│       │   └── RecruitmentFilter.tsx
│       └── page.tsx
```

### 使用例

```typescript
// app/(private)/messages/page.tsx
import { MessageList } from "./_components/MessageList";
import { MessageForm } from "./_components/MessageForm";

export default function MessagesPage() {
  return (
    <div>
      <h1>Messages</h1>
      <MessageList />
      <MessageForm />
    </div>
  );
}
```

### features/ との使い分け

| 配置場所                         | 用途                                         | 例                                   |
| -------------------------------- | -------------------------------------------- | ------------------------------------ |
| `app/[route]/_components/`       | そのページでのみ使用するコンポーネント       | ページ固有のレイアウト、フィルター   |
| `features/[feature]/components/` | 機能全体で使用するコンポーネント             | ドメインロジックを含むコンポーネント |
| `shared/components/`             | プロジェクト全体で使用する汎用コンポーネント | Button, Input, Dialog                |

---

## ベストプラクティス

### 1. app/ にビジネスロジックを書かない

`app/` はルーティングとページ構成に専念し、ビジネスロジックは `features/` に配置します。

```typescript
// Bad: app/ にビジネスロジックを含める
// app/(private)/recruitment/page.tsx
export default function RecruitmentPage() {
  const [recruitments, setRecruitments] = useState([]);

  useEffect(() => {
    // API呼び出しなどのビジネスロジック
    fetch("/api/recruitments").then(/* ... */);
  }, []);

  return <div>{/* ... */}</div>;
}

// Good: features/ のコンポーネントを組み立てる
// app/(private)/recruitment/page.tsx
import { RecruitmentList } from "@/features/recruitment/components/RecruitmentList";

export default function RecruitmentPage() {
  return <RecruitmentList />;
}
```

### 2. Route Groups を活用する

認証状態やユーザーロールなどでページをグループ化します。

```
app/
├── (public)/        # 認証不要
├── (private)/       # 認証必要
└── (admin)/         # 管理者のみ
```

### 3. プライベートフォルダで整理する

ページ固有のコンポーネントやユーティリティは `_` プレフィックスで管理します。

```
app/dashboard/
├── _components/     # ダッシュボード専用コンポーネント
├── _utils/          # ダッシュボード専用ユーティリティ
└── page.tsx
```

### 4. レイアウトを適切にネストする

共通部分はレイアウトに切り出し、再利用します。

```typescript
// app/(private)/layout.tsx - 認証チェックとヘッダー
// app/(private)/dashboard/layout.tsx - ダッシュボード固有のサイドバー
```

### 5. Server Components を優先する

デフォルトで Server Components を使用し、必要な場合のみ `"use client"` を追加します。

```typescript
// Server Component（デフォルト）
export default async function Page() {
  const data = await fetchData(); // サーバーで実行
  return <div>{data}</div>;
}

// Client Component（必要な場合のみ）
("use client");

export default function Page() {
  const [state, setState] = useState(0);
  return <button onClick={() => setState(state + 1)}>{state}</button>;
}
```

### 6. メタデータを設定する

SEO のためにメタデータを適切に設定します。

```typescript
// app/(private)/recruitment/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "求人管理",
  description: "求人の作成・編集・管理を行います",
};

export default function RecruitmentPage() {
  return <div>Recruitment</div>;
}
```

### 7. ローディングとエラー状態を定義する

`loading.tsx` と `error.tsx` で適切な UX を提供します。

```
app/dashboard/
├── loading.tsx      # ローディング中の表示
├── error.tsx        # エラー時の表示
└── page.tsx
```

---

## 参考資料

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
- [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Layouts and Templates](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates)
- [ディレクトリ構成ルール](../conventions/directory.md)
- [ファイル整理ルール](../conventions/file-organization.md)
