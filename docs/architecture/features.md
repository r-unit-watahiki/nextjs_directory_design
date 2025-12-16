# Feature-based 構成

このドキュメントでは、プロジェクトで採用している Feature-based 構成の設計思想、実装パターン、ベストプラクティスについて説明します。

## 目次

- [Feature-based 構成とは](#feature-based-構成とは)
- [設計思想](#設計思想)
- [機能の設計原則](#機能の設計原則)
- [標準的な機能構成](#標準的な機能構成)
- [機能間の連携](#機能間の連携)
- [実装パターン](#実装パターン)
- [ベストプラクティス](#ベストプラクティス)

---

## Feature-based 構成とは

Feature-based 構成は、アプリケーションを**機能（Feature）**単位で分割する設計手法です。
各機能に関連するすべてのコード（コンポーネント、フック、状態管理、ビジネスロジック）を 1 つのディレクトリにまとめます。

### 従来の構成との比較

#### 従来の Type-based 構成

```
src/
├── components/       # すべてのコンポーネント
├── hooks/            # すべてのフック
├── stores/           # すべてのストア
└── utils/            # すべてのユーティリティ
```

**問題点:**

- 機能追加時に複数のディレクトリを横断する必要がある
- 機能の削除が困難（どのファイルが関連しているか不明確）
- コードの責務が不明確
- スケールしにくい

#### Feature-based 構成

```
src/
├── features/
│   ├── auth/         # 認証機能のすべて
│   ├── recruitment/  # 求人機能のすべて
│   └── shift/        # シフト機能のすべて
└── shared/           # 共通コード
```

**メリット:**

- 機能ごとに独立した開発が可能
- 機能の追加・削除が容易
- コードの責務が明確
- スケーラブル

---

## 設計思想

### 1. 疎結合・高凝集

各機能は独立性を保ち（疎結合）、機能内のコードは密接に関連している（高凝集）状態を目指します。

```
features/
├── recruitment/      # 求人機能
│   ├── components/   # 求人関連のコンポーネント
│   ├── hooks/        # 求人関連のフック
│   ├── stores/       # 求人関連の状態管理
│   └── server/       # 求人関連のサーバーロジック
└── shift/            # シフト機能（recruitmentに依存しない）
    ├── components/
    ├── hooks/
    ├── stores/
    └── server/
```

### 2. コロケーション（Colocation）

関連するコードは可能な限り近くに配置します。

```typescript
// Good: 機能内で完結
features/recruitment/
├── components/RecruitmentForm.tsx     # フォームコンポーネント
├── hooks/useRecruitmentForm.ts        # フォーム専用フック
└── utils/validate-recruitment.ts      # フォーム専用バリデーション

// Bad: 分散配置
components/RecruitmentForm.tsx
hooks/useRecruitmentForm.ts
utils/validate-recruitment.ts
```

### 3. 明確な責務分離

各ディレクトリは明確な役割を持ちます。

- **features/**: 機能固有のビジネスロジック
- **shared/**: プロジェクト全体で共有される汎用コード
- **app/**: ルーティングと UI の組み立て
- **lib/**: 外部ライブラリの設定

---

## 機能の設計原則

### SOLID 原則の適用

#### 単一責任の原則（Single Responsibility Principle）

各機能は 1 つの責務を持ちます。

```
// Good: 明確な責務
features/auth/          # 認証機能のみ
features/recruitment/   # 求人機能のみ
features/shift/         # シフト機能のみ

// Bad: 複数の責務
features/user-management/  # 認証・プロフィール・設定が混在
```

#### 依存性逆転の原則（Dependency Inversion Principle）

機能間で直接依存せず、抽象（shared）に依存します。

```typescript
// Bad: 機能間の直接依存
// features/recruitment/components/RecruitmentCard.tsx
import { useAuth } from "@/features/auth/hooks/useAuth";

// Good: shared経由
// features/recruitment/components/RecruitmentCard.tsx
import { useAuth } from "@/shared/hooks/useAuth";
```

### 機能の粒度

#### 適切な機能の大きさ

機能は**ビジネスドメイン**に基づいて分割します。

```
// Good: ビジネスドメインに基づく分割
features/
├── auth/             # 認証
├── recruitment/      # 求人管理
├── shift/            # シフト管理
├── message/          # メッセージ
└── dashboard/        # ダッシュボード

// Bad: 技術的な分割
features/
├── forms/            # 技術的な分類
├── tables/           # 技術的な分類
└── modals/           # 技術的な分類
```

#### 機能が大きくなりすぎた場合

機能が複雑になった場合は、サブディレクトリで整理します。

```
features/recruitment/
├── components/
│   ├── list/              # 一覧関連
│   │   ├── RecruitmentList.tsx
│   │   ├── RecruitmentCard.tsx
│   │   └── RecruitmentFilter.tsx
│   ├── form/              # フォーム関連
│   │   ├── RecruitmentForm.tsx
│   │   ├── JobTypeSelector.tsx
│   │   └── SalaryInput.tsx
│   └── detail/            # 詳細関連
│       ├── RecruitmentDetail.tsx
│       └── ApplicantList.tsx
├── hooks/
├── stores/
└── server/
```

---

## 標準的な機能構成

各機能は以下の標準的な構成を持ちます。

```
features/
└── [feature-name]/           # 機能名（ケバブケース）
    ├── components/           # 機能固有のコンポーネント
    │   ├── FeatureList.tsx
    │   └── FeatureForm.tsx
    ├── hooks/                # 機能固有のカスタムフック
    │   ├── useFeature.ts
    │   └── useFeatureForm.ts
    ├── stores/               # 機能固有のストア（Zustand）
    │   └── useFeatureStore.ts
    ├── server/               # サーバーアクション・API呼び出し
    │   ├── actions.ts
    │   └── queries.ts
    ├── types/                # 機能固有の型定義
    │   └── feature-types.ts
    ├── utils/                # 機能固有のユーティリティ
    │   └── validate-feature.ts
    └── constants.ts          # 機能固有の定数
```

### 各ディレクトリの役割

#### components/

機能固有の UI コンポーネントを配置します。

```typescript
// features/recruitment/components/RecruitmentCard.tsx
import type { Recruitment } from "../types/recruitment-types";

type RecruitmentCardProps = {
  recruitment: Recruitment;
  onApply: (id: string) => void;
};

export function RecruitmentCard({
  recruitment,
  onApply,
}: RecruitmentCardProps) {
  return (
    <div>
      <h3>{recruitment.title}</h3>
      <p>{recruitment.salary}</p>
      <button onClick={() => onApply(recruitment.id)}>応募する</button>
    </div>
  );
}
```

#### hooks/

機能固有のカスタムフックを配置します。

```typescript
// features/recruitment/hooks/useRecruitmentForm.ts
import { useState } from "react";
import { createRecruitment } from "../server/actions";
import type { CreateRecruitmentInput } from "../types/recruitment-types";

export function useRecruitmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (data: CreateRecruitmentInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createRecruitment(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error };
}
```

#### stores/

機能固有のグローバル状態管理を配置します。

```typescript
// features/recruitment/stores/useRecruitmentStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecruitmentFilter = {
  keyword: string;
  minSalary: number;
  maxSalary: number;
  employmentType: string[];
};

type RecruitmentStore = {
  filter: RecruitmentFilter;
  setFilter: (filter: Partial<RecruitmentFilter>) => void;
  resetFilter: () => void;
};

const defaultFilter: RecruitmentFilter = {
  keyword: "",
  minSalary: 0,
  maxSalary: 10000000,
  employmentType: [],
};

export const useRecruitmentStore = create<RecruitmentStore>()(
  persist(
    (set) => ({
      filter: defaultFilter,
      setFilter: (newFilter) =>
        set((state) => ({ filter: { ...state.filter, ...newFilter } })),
      resetFilter: () => set({ filter: defaultFilter }),
    }),
    {
      name: "recruitment-filter-storage",
    }
  )
);
```

#### server/

Server Actions とデータ取得ロジックを配置します。

```typescript
// features/recruitment/server/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { recruitmentApi } from "@/lib/api/endpoints/recruitments";
import type { CreateRecruitmentInput } from "../types/recruitment-types";

export async function createRecruitment(data: CreateRecruitmentInput) {
  const recruitment = await recruitmentApi.create(data);
  revalidatePath("/recruitments");
  return recruitment;
}

export async function deleteRecruitment(id: string) {
  await recruitmentApi.delete(id);
  revalidatePath("/recruitments");
}
```

```typescript
// features/recruitment/server/queries.ts
import { recruitmentApi } from "@/lib/api/endpoints/recruitments";

export async function getRecruitments() {
  return await recruitmentApi.index();
}

export async function getRecruitment(id: string) {
  return await recruitmentApi.show(id);
}
```

#### types/

機能固有の型定義を配置します。

```typescript
// features/recruitment/types/recruitment-types.ts
export type RecruitmentStatus = "draft" | "published" | "closed";

export type EmploymentType = "full-time" | "part-time" | "contract";

export interface Recruitment = {
  id: string;
  title: string;
  description: string;
  salary: number;
  employmentType: EmploymentType;
  status: RecruitmentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateRecruitmentInput = Omit<
  Recruitment,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateRecruitmentInput = Partial<CreateRecruitmentInput>;
```

#### utils/

機能固有のユーティリティ関数を配置します。

```typescript
// features/recruitment/utils/validate-salary.ts
export function validateSalary(salary: number): boolean {
  return salary > 0 && salary <= 100000000;
}

export function formatSalary(salary: number): string {
  return `¥${salary.toLocaleString()}`;
}
```

#### constants.ts

機能固有の定数を配置します。

```typescript
// features/recruitment/constants.ts
export const EMPLOYMENT_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
} as const;

export const RECRUITMENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  CLOSED: "closed",
} as const;

export const MIN_SALARY = 0;
export const MAX_SALARY = 100000000;
```

---

## 機能間の連携

### 原則: 機能間の直接依存を避ける

機能間で直接依存すると、疎結合が崩れてメンテナンスが困難になります。

```typescript
// Bad: 機能間の直接依存
// features/recruitment/components/RecruitmentCard.tsx
import { useAuth } from "@/features/auth/hooks/useAuth";

function RecruitmentCard() {
  const { user } = useAuth(); // 直接依存
  // ...
}
```

### 方法 1: shared/ 経由で連携

複数の機能で使用する場合は `shared/` に配置します。

```typescript
// shared/hooks/useAuth.ts
export function useAuth() {
  // 認証ロジック
}

// features/recruitment/components/RecruitmentCard.tsx
import { useAuth } from "@/shared/hooks/useAuth";

function RecruitmentCard() {
  const { user } = useAuth(); // shared経由
  // ...
}
```

### 方法 2: Props で受け取る

親コンポーネント（app/）で組み立て、Props で渡します。

```tsx
// app/(private)/recruitments/page.tsx (Server Component)
import { RecruitmentList } from "@/features/recruitment/components";
import { auth } from "@/lib/auth";

export default async function RecruitmentsPage() {
  const session = await auth();
  const user = session?.user;

  return <RecruitmentList currentUser={user} />;
}

// features/recruitment/components/RecruitmentList.tsx
type RecruitmentListProps = {
  currentUser: User | null;
};

export function RecruitmentList({ currentUser }: RecruitmentListProps) {
  // currentUserをPropsで受け取る
}
```

### 方法 3: イベント駆動

Store やイベントバスを使用してイベント駆動で連携します。

```typescript
// shared/stores/useNotificationStore.ts
import { create } from "zustand";

type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type NotificationStore = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: crypto.randomUUID() },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

// features/recruitment/components/RecruitmentForm.tsx
import { useNotificationStore } from "@/shared/stores/useNotificationStore";

export function RecruitmentForm() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const handleSubmit = async () => {
    try {
      await createRecruitment(data);
      addNotification({ message: "求人を作成しました", type: "success" });
    } catch (error) {
      addNotification({ message: "エラーが発生しました", type: "error" });
    }
  };

  // ...
}
```

---

## 実装パターン

### パターン 1: CRUD 機能

基本的な CRUD 機能の実装パターンです。

```
features/recruitment/
├── components/
│   ├── RecruitmentList.tsx        # 一覧表示
│   ├── RecruitmentCard.tsx        # カード表示
│   ├── RecruitmentForm.tsx        # 作成・編集フォーム
│   └── RecruitmentDetail.tsx      # 詳細表示
├── hooks/
│   └── useRecruitmentForm.ts      # フォームロジック
├── server/
│   ├── actions.ts                 # CRUD操作
│   └── queries.ts                 # データ取得
└── types/
    └── recruitment-types.ts       # 型定義
```

### パターン 2: フォーム機能

複雑なフォームを持つ機能の実装パターンです。

```
features/recruitment/
├── components/
│   ├── RecruitmentForm.tsx        # メインフォーム
│   ├── JobTypeSelector.tsx        # 雇用形態選択
│   ├── SalaryInput.tsx            # 給与入力
│   └── DescriptionEditor.tsx      # 説明エディタ
├── hooks/
│   ├── useRecruitmentForm.ts      # フォーム全体のロジック
│   └── useJobTypeSelector.ts      # 雇用形態選択のロジック
├── server/
│   ├── actions.ts
│   └── queries.ts
└── schemas/
    └── recruitment-schema.ts      # Zodスキーマ
```

```typescript
// features/recruitment/schemas/recruitment-schema.ts
import { z } from "zod";

export const recruitmentSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(100),
  description: z.string().min(1, "説明は必須です"),
  salary: z.number().positive("給与は正の数で入力してください"),
  employmentType: z.enum(["full-time", "part-time", "contract"]),
});

export type RecruitmentFormData = z.infer<typeof recruitmentSchema>;
```

### パターン 3: 複雑な状態管理

フィルターやソートなど、複雑な状態を持つ機能の実装パターンです。

```
features/recruitment/
├── components/
│   ├── RecruitmentList.tsx
│   ├── RecruitmentFilter.tsx      # フィルターUI
│   └── RecruitmentSort.tsx        # ソートUI
├── stores/
│   └── useRecruitmentStore.ts     # フィルター・ソート状態
└── hooks/
    └── useFilteredRecruitments.ts # フィルタリングロジック
```

```typescript
// features/recruitment/hooks/useFilteredRecruitments.ts
import { useMemo } from "react";
import { useRecruitmentStore } from "../stores/useRecruitmentStore";
import type { Recruitment } from "../types/recruitment-types";

export function useFilteredRecruitments(recruitments: Recruitment[]) {
  const filter = useRecruitmentStore((state) => state.filter);

  return useMemo(() => {
    return recruitments.filter((recruitment) => {
      // キーワードフィルター
      if (
        filter.keyword &&
        !recruitment.title.toLowerCase().includes(filter.keyword.toLowerCase())
      ) {
        return false;
      }

      // 給与フィルター
      if (
        recruitment.salary < filter.minSalary ||
        recruitment.salary > filter.maxSalary
      ) {
        return false;
      }

      // 雇用形態フィルター
      if (
        filter.employmentType.length > 0 &&
        !filter.employmentType.includes(recruitment.employmentType)
      ) {
        return false;
      }

      return true;
    });
  }, [recruitments, filter]);
}
```

---

## ベストプラクティス

### 1. 機能の境界を明確にする

機能の責務を明確にし、境界を越えないようにします。

```
// Good: 明確な境界
features/auth/          # 認証のみ
features/recruitment/   # 求人管理のみ

// Bad: 境界が曖昧
features/user/          # 認証・プロフィール・設定が混在
```

### 2. 最初は小さく始める

機能は最初から完璧にせず、必要に応じて拡張します（YAGNI 原則）。

```
// Step 1: 最小限の構成で始める
features/recruitment/
├── components/
│   └── RecruitmentList.tsx
└── server/
    └── queries.ts

// Step 2: 必要に応じて拡張
features/recruitment/
├── components/
│   ├── RecruitmentList.tsx
│   ├── RecruitmentCard.tsx    # 追加
│   └── RecruitmentForm.tsx    # 追加
├── hooks/
│   └── useRecruitmentForm.ts  # 追加
└── server/
    ├── actions.ts             # 追加
    └── queries.ts
```

### 3. 共通化は 2 回目以降

コードの共通化は、実際に 2 箇所以上で使われるようになってから行います。

```typescript
// Step 1: 機能内で実装
// features/recruitment/utils/format-salary.ts
export function formatSalary(salary: number): string {
  return `¥${salary.toLocaleString()}`;
}

// Step 2: 他の機能（shift）でも使うようになったらsharedに移動
// shared/utils/format-currency.ts
export function formatCurrency(amount: number, currency = "¥"): string {
  return `${currency}${amount.toLocaleString()}`;
}
```

### 4. Server Components と Client Components を適切に分離

データ取得は Server Components、インタラクションは Client Components で行います。

```tsx
// app/(private)/recruitments/page.tsx (Server Component)
import { RecruitmentList } from "@/features/recruitment/components";
import { getRecruitments } from "@/features/recruitment/server/queries";

export default async function RecruitmentsPage() {
  const recruitments = await getRecruitments(); // サーバー側でデータ取得

  return <RecruitmentList initialData={recruitments} />;
}

// features/recruitment/components/RecruitmentList.tsx (Client Component)
("use client");

import type { Recruitment } from "../types/recruitment-types";

type RecruitmentListProps = {
  initialData: Recruitment[];
};

export function RecruitmentList({ initialData }: RecruitmentListProps) {
  // クライアント側でのインタラクション
  return <div>...</div>;
}
```

### 5. index.ts でエクスポートを集約

各機能の `components/index.ts` でエクスポートを集約します。

```typescript
// features/recruitment/components/index.ts
export { RecruitmentList } from "./RecruitmentList";
export { RecruitmentCard } from "./RecruitmentCard";
export { RecruitmentForm } from "./RecruitmentForm";
export { RecruitmentDetail } from "./RecruitmentDetail";

// 使用側
import {
  RecruitmentList,
  RecruitmentCard,
} from "@/features/recruitment/components";
```

### 6. 型定義を適切に配置

```typescript
// Good: 機能固有の型 → features
// features/recruitment/types/recruitment-types.ts
export type Recruitment = { ... };
export type RecruitmentStatus = "draft" | "published";

// Good: 複数機能で使う型 → shared
// shared/types/common-types.ts
export type Id = string;
export type Timestamp = Date;

// Good: 外部APIの型 → lib
// lib/api/schemas/recruitments.ts
export const recruitmentSchema = z.object({ ... });
```

### 7. テストファイルのコロケーション

テストファイルは対象ファイルと同じディレクトリに配置します。

```
features/recruitment/
├── components/
│   ├── RecruitmentCard.tsx
│   ├── RecruitmentCard.test.tsx      # テストファイル
│   ├── RecruitmentForm.tsx
│   └── RecruitmentForm.test.tsx
└── utils/
    ├── validate-salary.ts
    └── validate-salary.test.ts
```

---

## チェックリスト

新しい機能を作成する際は、以下を確認してください。

- [ ] 機能名はビジネスドメインに基づいている
- [ ] 機能の責務が明確である
- [ ] 他の機能に直接依存していない
- [ ] 標準的な構成に従っている
- [ ] 必要最小限の構成から始めている
- [ ] Server Components と Client Components が適切に分離されている
- [ ] index.ts でエクスポートを集約している
- [ ] 型定義が適切に配置されている

---

## 関連ドキュメント

- [ディレクトリ構成ルール](../conventions/directory.md)
- [ファイル整理ルール](../conventions/file-organization.md)
- [状態管理](./state-management.md)
- [App Router](./app-router.md)
