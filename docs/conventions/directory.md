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
- 外部 API（Rails API など）の統合

**ルール:**

- ライブラリごとにディレクトリを分割
- 設定ファイルは明確に命名
- 型安全なラッパーを提供

**構成例:**

```
lib/
└── api/                     # 外部API統合（Rails APIなど）
    ├── client.ts            # 基本的なAPIクライアント設定
    ├── interceptors.ts      # リクエスト/レスポンスインターセプター
    ├── schemas/             # Zodスキーマ定義
    │   ├── auth.ts          # 認証関連スキーマ
    │   ├── users.ts         # ユーザー関連スキーマ
    │   ├── recruitments.ts  # 求人関連スキーマ
    │   └── shifts.ts        # シフト関連スキーマ
    └── endpoints/           # エンドポイントごとのAPI関数
        ├── auth.ts          # 認証関連API
        ├── users.ts         # ユーザー関連API
        ├── recruitments.ts  # 求人関連API
        └── shifts.ts        # シフト関連API
```

#### API 統合の詳細（lib/api/）

外部 API（Rails API など）を統合する場合の構成です。

**各ファイルの役割:**

1. **client.ts**: 基本的な fetch ラッパー、認証トークンの付与、エラーハンドリング
2. **interceptors.ts**: リクエスト前処理・レスポンス後処理の共通ロジック
3. **schemas/**: Zod スキーマによるリクエスト/レスポンスのバリデーション定義
4. **endpoints/**: 実際の API 呼び出し関数（schemas を使用してバリデーション）

**schemas の例:**

```typescript
// lib/api/schemas/recruitments.ts
import { z } from "zod";

// レスポンス用
export const recruitmentListSchema = z.object({
  id: z.string(),
  title: z.string(),
  salary: z.number().positive(),
  // ...
});

// リクエストパラメータ用
export const createRecruitmentSchema = z.object({
  title: z.string().min(1).max(100),
  salary: z.number().positive(),
  // ...
});

export type Recruitment = z.infer<typeof recruitmentSchema>;
export type CreateRecruitmentInput = z.infer<typeof createRecruitmentSchema>;
```

**endpoints の例:**

```typescript
// lib/api/endpoints/recruitments.ts
import { apiClient } from "../client";
import {
  recruitmentSchema,
  createRecruitmentSchema,
} from "../schemas/recruitments";

export const recruitmentApi = {
  async index() {
    const response = await apiClient("/api/v1/recruitments");
    return recruitmentsResponseSchema.parse(response);
  },

  async create(data: CreateRecruitmentInput) {
    const validated = createRecruitmentSchema.parse(data);
    const response = await apiClient("/api/v1/recruitments", {
      method: "POST",
      body: JSON.stringify(validated),
    });
    return recruitmentSchema.parse(response);
  },
};
```

**使用例:**

```typescript
// features/recruitment/server/queries.ts
import { recruitmentApi } from "@/lib/api/endpoints/recruitments";

export async function getRecruitments() {
  return await recruitmentApi.get();
}
```

---

## 配置ルール

### ファイルをどこに配置するか

以下の判断フローに従ってファイルの配置場所を決定します。

#### ステップ 1: ファイルの種類を特定する

```
Q1: このファイルはNext.jsの特別なファイルですか？
    (page.tsx, layout.tsx, loading.tsx, error.tsx, route.ts等)

    YES → app/ に配置
    NO  → Q2へ

Q2: このファイルは外部ライブラリの設定・ラッパーですか？
    (APIクライアント、認証プロバイダー、データベース接続等)

    YES → lib/ に配置
    NO  → Q3へ

Q3: このファイルは特定の機能に関連していますか？

    NO  → shared/ に配置（汎用的なコード）
    YES → Q4へ
```

#### ステップ 2: features/ と shared/ を判断する（最重要）

```
Q4: このファイルは特定の機能でのみ使用されますか？

    判断基準:
    ┌─────────────────────────────────────────────────┐
    │ features/ に配置する条件（以下のいずれか）      │
    ├─────────────────────────────────────────────────┤
    │ - 特定の機能ドメインに強く結びついている        │
    │ - 機能固有のビジネスロジックを含む              │
    │ - 現時点で1つの機能でのみ使用されている         │
    │ - 他の機能から独立して存在できる                │
    └─────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────┐
    │ shared/ に配置する条件（以下のいずれか）        │
    ├─────────────────────────────────────────────────┤
    │ - 2つ以上の機能で使用されている                 │
    │ - どの機能にも依存しない汎用的なコード          │
    │ - UIライブラリのコンポーネント                  │
    │ - 汎用的なユーティリティ・ヘルパー関数          │
    │ - プロジェクト全体の共通型定義                  │
    └─────────────────────────────────────────────────┘

    YES (features条件に該当) → features/[feature-name]/ に配置
    NO  (shared条件に該当)   → shared/ に配置
```

### 判断に迷いやすいケースと解決方法

#### ケース 1: 複数機能で使うが機能固有のロジックを含む

```typescript
// 例: 求人とシフトの両方で使う「応募者ステータス」コンポーネント

// Bad: どちらに置くか迷う
features / recruitment / components / ApplicantStatus.tsx; // recruitmentだけ？
shared / components / ApplicantStatus.tsx; // 共有？

// Good: ビジネスロジックを分離
// 機能固有のロジックは各featuresに
features / recruitment / utils / get - applicant - status.ts;
features / shift / utils / get - applicant - status.ts;

// 表示用の汎用コンポーネントはsharedに
shared / components / common / StatusBadge.tsx; // 汎用的なステータス表示
```

**判断ポイント**: ビジネスロジックと表示ロジックを分離する

#### ケース 2: 認証など複数箇所で使う機能

```typescript
// 例: 認証フック - 全ページで使用される

// Bad: featuresに置くと他機能から依存してしまう
features / auth / hooks / useAuth.ts;
// → features/recruitment から features/auth に依存（避けるべき）

// Good: 全体で使用されるならsharedに
shared / hooks / useAuth.ts;
// → どの機能からも自由に使用可能

// authのビジネスロジック（ログイン処理等）はfeaturesに残す
features / auth / server / actions.ts; // ログイン・ログアウト処理
features / auth / components / LoginForm.tsx; // ログインフォーム
```

**判断ポイント**: 2 つ以上の機能で使う場合は shared に配置

#### ケース 3: 機能固有だが将来的に汎用化する可能性がある

```typescript
// 例: 最初は求人機能でのみ使う日付選択コンポーネント

// Step1: まずはfeaturesに配置
features/recruitment/components/DateRangePicker.tsx

// Step2: 他の機能（シフト等）でも使うようになったら移動
// 1. sharedに移動
shared/components/common/DateRangePicker.tsx

// 2. featuresの参照を更新
// features/recruitment/components/RecruitmentForm.tsx
- import { DateRangePicker } from "./DateRangePicker";
+ import { DateRangePicker } from "@/shared/components/common";
```

**判断ポイント**: 最初は features に配置し、実際に複数箇所で使うようになったら shared に移動する（YAGNI 原則）

#### ケース 4: 型定義の配置

```typescript
// Good: 機能固有の型 → features
features/recruitment/types/recruitment-types.ts
export interface Recruitment { ... }
export type RecruitmentStatus = "draft" | "published";

// Good: 複数機能で使う共通型 → shared
shared/types/common-types.ts
export type Id = string;
export type Timestamp = Date;
export interface Pagination { ... }

// Good: API全体の型 → shared
shared/types/api-types.ts
export interface ApiResponse<T> { ... }
export interface ApiError { ... }

// Good: 外部API（Rails等）のスキーマ → lib
lib/api/schemas/recruitments.ts
export const recruitmentSchema = z.object({ ... });
```

**判断ポイント**:

- 機能のドメインモデル → features
- 複数機能で共有 → shared
- 外部 API の型定義 → lib

#### ケース 5: フック・ユーティリティの配置

```typescript
// Good: 機能固有のフック → features
features / recruitment / hooks / useRecruitmentForm.ts; // 求人フォーム専用
features / recruitment / hooks / useRecruitmentFilter.ts; // 求人フィルター専用

// Good: 汎用的なフック → shared
shared / hooks / useDebounce.ts; // どこでも使える
shared / hooks / useLocalStorage.ts; // どこでも使える
shared / hooks / useAuth.ts; // 全体で使う認証

// Good: 機能固有のユーティリティ → features
features / recruitment / utils / validate - salary.ts; // 給与バリデーション
features / recruitment / utils / format - job - type.ts; // 雇用形態フォーマット

// Good: 汎用的なユーティリティ → shared
shared / utils / format - date.ts; // 日付フォーマット
shared / utils / cn.ts; // className結合
```

**判断ポイント**: 機能ドメインの知識が必要かどうか

### 配置場所のクイックリファレンス

| ファイルの種類             | 配置場所                      | 例                             |
| -------------------------- | ----------------------------- | ------------------------------ |
| **Next.js 特別なファイル** | `app/`                        | page.tsx, layout.tsx, route.ts |
| **外部ライブラリ設定**     | `lib/`                        | API クライアント、DB 設定      |
| **機能固有コンポーネント** | `features/[name]/components/` | LoginForm, RecruitmentCard     |
| **汎用 UI コンポーネント** | `shared/components/ui/`       | Button, Input, Dialog          |
| **機能固有フック**         | `features/[name]/hooks/`      | useRecruitmentForm             |
| **汎用フック**             | `shared/hooks/`               | useDebounce, useAuth           |
| **機能固有型定義**         | `features/[name]/types/`      | Recruitment, RecruitmentStatus |
| **共通型定義**             | `shared/types/`               | ApiResponse, Pagination        |
| **機能固有ユーティリティ** | `features/[name]/utils/`      | validate-salary                |
| **汎用ユーティリティ**     | `shared/utils/`               | format-date, cn                |
| **サーバーアクション**     | `features/[name]/server/`     | actions.ts, queries.ts         |
| **外部 API スキーマ**      | `lib/api/schemas/`            | recruitments.ts                |

### 実践的な配置例

#### 例 1: ログインフォームコンポーネント

```
Q: ログインフォームはどこに配置する？
A: features/auth/components/LoginForm.tsx

理由:
- 認証機能に強く結びついている
- ログイン固有のビジネスロジックを含む
- 他機能から独立している
```

#### 例 2: Button コンポーネント

```
Q: Buttonコンポーネントはどこに配置する？
A: shared/components/ui/Button.tsx

理由:
- プロジェクト全体で使用される
- どの機能にも依存しない汎用UI
- UIライブラリのコンポーネント
```

#### 例 3: 認証フック（useAuth）

```
Q: useAuthフックはどこに配置する？
A: shared/hooks/useAuth.ts

理由:
- 複数のページ・機能で使用される
- プロジェクト全体の認証状態を管理
- 他のfeaturesから参照される

※ ログイン処理自体は features/auth/server/actions.ts に配置
```

#### 例 4: 求人データの型定義

```
Q: Recruitment型はどこに配置する？
A: features/recruitment/types/recruitment-types.ts

理由:
- 求人機能のドメインモデル
- 求人固有のビジネスルールを含む
```

#### 例 5: 日付フォーマット関数

```
Q: 日付フォーマット関数はどこに配置する？
A: shared/utils/format-date.ts

理由:
- プロジェクト全体で使用される
- どの機能にも依存しない汎用ユーティリティ
- ドメイン知識が不要
```

#### 例 6: 外部 API クライアント

```
Q: Rails APIのクライアント設定はどこに配置する？
A: lib/api/client.ts

理由:
- 外部ライブラリ（fetch）のラッパー
- グローバルな設定
```

#### 例 7: ダッシュボードページ

```
Q: ダッシュボードページはどこに配置する？
A: app/(private)/dashboard/page.tsx

理由:
- Next.js App Routerの特別なファイル
- ルーティングを定義
```

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
