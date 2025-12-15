# ディレクトリ構成ルール

このドキュメントでは、プロジェクト全体のディレクトリ構成のルールと各ディレクトリの役割について定義します。

## 目次

- [基本原則](#基本原則)
- [ディレクトリ構成概要](#ディレクトリ構成概要)
- [各ディレクトリの詳細](#各ディレクトリの詳細)
- [配置ルール](#配置ルール)

---

## 基本原則

### 1. Feature-based 構成

機能ごとにディレクトリを分割し、関連するコードを同じ場所に配置します。

**メリット:**

- 機能単位での開発・保守が容易
- コードの責務が明確
- 不要な機能の削除が簡単
- チーム開発でのコンフリクトが減少

### 2. コロケーション (Colocation)

関連するファイルは可能な限り近くに配置します。

**例:**

- コンポーネントとそのスタイル
- コンポーネントとそのテスト
- 機能とその専用フック・ストア

### 3. 明確な責務分離

- **app/**: ルーティングとページ構成（Next.js App Router）
- **features/**: 機能ごとのビジネスロジック
- **shared/**: プロジェクト全体で共有される汎用的なコード
- **lib/**: 外部ライブラリの設定やラッパー

---

## ディレクトリ構成概要

```
src/
├── app/                    # Next.js App Router（ルーティング）
│   ├── (private)/          # 認証が必要なページグループ
│   ├── (public)/           # 公開ページグループ
│   ├── api/                # API Routes
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # トップページ
│
├── features/               # 機能ごとのディレクトリ
│   ├── auth/               # 認証機能
│   ├── recruitment/        # 求人機能
│   ├── shift/              # シフト機能
│   ├── message/            # メッセージ機能
│   └── dashboard/          # ダッシュボード機能
│
├── shared/                 # 共有コード
│   ├── components/         # 共有コンポーネント
│   ├── hooks/              # 共有カスタムフック
│   ├── stores/             # 共有ストア
│   ├── types/              # 共有型定義
│   └── utils/              # 共有ユーティリティ
│
└── lib/                    # 外部ライブラリの設定
    └── ...                 # ライブラリ設定
```

---

## 各ディレクトリの詳細

### app/

Next.js App Router のルーティングディレクトリです。

**役割:**

- ページのルーティング定義
- レイアウト構成
- API Routes の定義

**ルール:**

- ビジネスロジックは配置しない
- UI の構成と `features/` からのコンポーネント組み立てに専念
- ページ固有のコンポーネントは `_components/` に配置

**構成例:**

```
app/
├── (private)/                    # 認証が必要なページ
│   ├── layout.tsx                # プライベートページ共通レイアウト
│   ├── _components/              # プライベートページ共有コンポーネント
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── dashboard/
│   │   └── page.tsx              # /dashboard
│   ├── messages/
│   │   └── page.tsx              # /messages
│   ├── recruitment/
│   │   ├── page.tsx              # /recruitment
│   │   └── [id]/
│   │       └── page.tsx          # /recruitment/[id]
│   └── shifts/
│       └── page.tsx              # /shifts
│
├── (public)/                     # 公開ページ
│   ├── layout.tsx                # 公開ページ共通レイアウト
│   ├── login/
│   │   └── page.tsx              # /login
│   └── register/
│       └── page.tsx              # /register
│
├── api/                          # API Routes
│   ├── auth/
│   │   └── route.ts
│   └── users/
│       └── route.ts
│
├── layout.tsx                    # ルートレイアウト
├── page.tsx                      # トップページ（/）
├── loading.tsx                   # グローバルローディング
├── error.tsx                     # グローバルエラー
└── not-found.tsx                 # 404ページ
```

**Route Groups の使用:**

Route Groups `(フォルダ名)` を使用してページを論理的にグループ化します。

```
app/
├── (private)/     # 認証が必要なページ
├── (public)/      # 公開ページ
└── (marketing)/   # マーケティングページ
```

**プライベートフォルダ:**

`_` プレフィックスを付けたフォルダはルーティング対象外になります。

```
app/
├── _components/   # ルーティング対象外（共有コンポーネント）
├── _utils/        # ルーティング対象外（ユーティリティ）
└── dashboard/     # ルーティング対象（/dashboard）
```

---

### features/

機能ごとにディレクトリを分割し、その機能に関連するすべてのコードを配置します。

**役割:**

- 機能固有のビジネスロジック
- 機能固有のコンポーネント
- 機能固有の状態管理
- 機能固有のユーティリティ

**ルール:**

- 各機能は独立性を保つ（疎結合）
- 他の機能への直接的な依存は避ける
- 共有が必要な場合は `shared/` に移動

**標準的な構成:**

```
features/
└── [feature-name]/          # 機能名（ケバブケース）
    ├── components/          # 機能固有のコンポーネント
    │   ├── FeatureList.tsx
    │   └── FeatureForm.tsx
    ├── hooks/               # 機能固有のカスタムフック
    │   ├── useFeature.ts
    │   └── useFeatureForm.ts
    ├── stores/              # 機能固有のストア（Zustand）
    │   └── useFeatureStore.ts
    ├── server/              # サーバーアクション・API呼び出し
    │   ├── actions.ts
    │   └── queries.ts
    ├── types/               # 機能固有の型定義
    │   └── feature-types.ts
    ├── utils/               # 機能固有のユーティリティ
    │   └── validate-feature.ts
    └── constants.ts         # 機能固有の定数
```

**実例: auth 機能**

```
features/
└── auth/
    ├── components/
    │   ├── LoginForm.tsx           # ログインフォーム
    │   └── RegisterForm.tsx        # 登録フォーム
    ├── hooks/
    │   └── useAuth.ts              # 認証フック
    ├── stores/
    │   └── useAuthStore.ts         # 認証ストア
    ├── server/
    │   ├── actions.ts              # Server Actions
    │   └── queries.ts              # データ取得
    └── types/
        └── auth-types.ts           # 認証関連の型
```

**実例: recruitment 機能**

```
features/
└── recruitment/
    ├── components/
    │   ├── RecruitmentList.tsx     # 求人一覧
    │   ├── RecruitmentCard.tsx     # 求人カード
    │   └── RecruitmentForm.tsx     # 求人作成フォーム
    ├── hooks/
    │   ├── useRecruitment.ts       # 求人データフック
    │   └── useRecruitmentForm.ts   # 求人フォームフック
    ├── stores/
    │   └── useRecruitmentStore.ts  # 求人ストア
    ├── server/
    │   ├── actions.ts              # 求人CRUD操作
    │   └── queries.ts              # 求人データ取得
    └── types/
        └── recruitment-types.ts    # 求人関連の型
```

**機能間の依存:**

機能間で直接的な依存は避け、必要な場合は以下のいずれかを選択します。

1. **shared/ に移動**: 複数の機能で使用する場合
2. **Props で受け取る**: 親コンポーネント（app/）で組み立て
3. **イベント駆動**: ストアやイベントバスを使用

```typescript
// Bad: 機能間の直接的な依存
// features/recruitment/components/RecruitmentCard.tsx
import { useAuth } from "@/features/auth/hooks/useAuth";

// Good: shared経由
// features/recruitment/components/RecruitmentCard.tsx
import { useAuth } from "@/shared/hooks/useAuth";

// Good: Propsで受け取る
// features/recruitment/components/RecruitmentCard.tsx
interface Props {
  currentUserId: string;
}
```

---

### shared/

プロジェクト全体で共有される汎用的なコードを配置します。

**役割:**

- 複数の機能で使用されるコンポーネント
- 複数の機能で使用されるフック
- プロジェクト全体の状態管理
- プロジェクト全体の型定義

**ルール:**

- 特定の機能に依存しない汎用的なコードのみ配置
- 2 つ以上の機能で使用される場合に移動を検討
- ビジネスロジックは含めない

**構成:**

```
shared/
├── components/              # 共有コンポーネント
│   ├── ui/                  # UIコンポーネント（shadcn/ui等）
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Dialog.tsx
│   │   └── Table.tsx
│   ├── layout/              # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── common/              # 汎用コンポーネント
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── Pagination.tsx
│
├── hooks/                   # 共有カスタムフック
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useAuth.ts           # 認証フック（全体で使用）
│
├── stores/                  # 共有ストア
│   ├── useThemeStore.ts     # テーマストア
│   └── useNotificationStore.ts  # 通知ストア
│
├── types/                   # 共有型定義
│   ├── common-types.ts      # 汎用型
│   ├── api-types.ts         # API関連の型
│   └── database-types.ts    # データベース関連の型
│
└── utils/                   # 共有ユーティリティ
    ├── format-date.ts
    ├── validate-email.ts
    ├── cn.ts                # classname utility
    └── api-client.ts
```

**共有コンポーネントの分類:**

1. **ui/**: UI ライブラリのコンポーネント（shadcn/ui など）
2. **layout/**: レイアウト用コンポーネント
3. **common/**: その他の汎用コンポーネント

---

### lib/

外部ライブラリの設定やラッパーを配置します。

**役割:**

- 外部ライブラリの初期化
- ライブラリのラッパー関数
- グローバルな設定

**ルール:**

- ライブラリごとにディレクトリを分割
- 設定ファイルは明確に命名
- 型安全なラッパーを提供

**構成例:**

```
lib/
├── stripe/
│   ├── client.ts            # Stripe初期化
│   └── webhooks.ts          # Webhook処理
├── redis/
│   └── client.ts            # Redis接続
├── email/
│   ├── client.ts            # メール送信設定
│   └── templates/           # メールテンプレート
└── auth/
    └── config.ts            # 認証設定（NextAuth等）
```

**例: 外部 API クライアント設定**

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // 認証トークンの取得
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
```

---

## 配置ルール

### ファイルをどこに配置するか

以下のフローチャートに従ってファイルの配置場所を決定します。

```
質問: このファイルは何ですか？

├─ Next.jsの特別なファイル（page.tsx, layout.tsx等）
│  └─ → app/ に配置
│
├─ 外部ライブラリの設定
│  └─ → lib/ に配置
│
├─ 特定の機能に関連するコード
│  ├─ その機能でのみ使用される
│  │  └─ → features/[feature-name]/ に配置
│  └─ 複数の機能で使用される
│     └─ → shared/ に配置
│
└─ プロジェクト全体で使用される汎用コード
   └─ → shared/ に配置
```

### 具体例

**Q: ログインフォームコンポーネントはどこに配置する？**

- A: `features/auth/components/LoginForm.tsx`
- 理由: 認証機能固有のコンポーネント

**Q: Button コンポーネントはどこに配置する？**

- A: `shared/components/ui/Button.tsx`
- 理由: プロジェクト全体で使用される汎用 UI コンポーネント

**Q: 日付フォーマット関数はどこに配置する？**

- A: `shared/utils/format-date.ts`
- 理由: プロジェクト全体で使用される汎用ユーティリティ

**Q: 求人データの型定義はどこに配置する？**

- A: `features/recruitment/types/recruitment-types.ts`
- 理由: 求人機能固有の型定義

**Q: 外部 API クライアントの設定はどこに配置する？**

- A: `lib/api/client.ts`
- 理由: 外部ライブラリの設定

**Q: ダッシュボードページはどこに配置する？**

- A: `app/(private)/dashboard/page.tsx`
- 理由: Next.js App Router のページファイル

---

## ディレクトリ構成のベストプラクティス

### 1. 浅い階層を保つ

ディレクトリの階層は 3〜4 レベル程度に抑えます。

```
// Good
features/auth/components/LoginForm.tsx

// Bad: 深すぎる
features/auth/ui/forms/authentication/login/LoginForm.tsx
```

### 2. 明確な命名

ディレクトリ名は役割を明確に表現します。

```
// Good
features/auth/
features/recruitment/
shared/components/ui/

// Bad
features/module1/
features/stuff/
shared/misc/
```

### 3. 一貫性を保つ

すべての機能ディレクトリは同じ構造を持ちます。

```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── server/
├── recruitment/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── server/
└── shift/
    ├── components/
    ├── hooks/
    ├── stores/
    └── server/
```

### 4. index.ts でエクスポートを集約

各ディレクトリに `index.ts` を配置し、エクスポートを集約します。

```typescript
// features/auth/components/index.ts
export { LoginForm } from "./LoginForm";
export { RegisterForm } from "./RegisterForm";

// 使用側
import { LoginForm, RegisterForm } from "@/features/auth/components";
```

### 5. テストファイルは隣に配置

テストファイルは対象ファイルと同じディレクトリに配置します。

```
features/auth/components/
├── LoginForm.tsx
├── LoginForm.test.tsx
├── RegisterForm.tsx
└── RegisterForm.test.tsx
```

---

## チェックリスト

新しいファイルやディレクトリを作成する際は、以下を確認してください。

- [ ] ファイルは適切なディレクトリに配置されている
- [ ] ディレクトリ名はケバブケースになっている
- [ ] 機能固有のコードは `features/` に配置されている
- [ ] 共有コードは `shared/` に配置されている
- [ ] ライブラリの設定は `lib/` に配置されている
- [ ] ディレクトリの階層が深すぎない（3〜4 レベル程度）
- [ ] 他の機能と一貫性のある構造になっている
- [ ] 必要に応じて `index.ts` でエクスポートを集約している

---

## 参考資料

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [ファイル整理ルール](./file-organization.md)
