# ファイル整理ルール

このドキュメントでは、ファイル単位での整理ルール、命名規則、コロケーション、ファイル分割の基準について定義します。

## 目次

- [基本原則](#基本原則)
- [ファイルの配置ルール](#ファイルの配置ルール)
- [コロケーション（Colocation）](#コロケーションcolocation)
- [ファイル分割の基準](#ファイル分割の基準)
- [index.ts によるエクスポート集約](#indexts-によるエクスポート集約)
- [ベストプラクティス](#ベストプラクティス)

---

## 基本原則

### 1. コロケーション（関連ファイルを近くに配置）

関連するファイルは可能な限り近くに配置します。

```
features/auth/components/
├── LoginForm.tsx          # コンポーネント
└── LoginForm.module.css   # スタイル（必要な場合）
```

### 2. 単一責任の原則

1 つのファイルは 1 つの責務を持ちます。

```typescript
// Good: 1つのコンポーネント
export function Button() { ... }

// Bad: 複数のコンポーネントを1ファイルに
export function Button() { ... }
export function Input() { ... }
export function Select() { ... }
```

### 3. 明確な命名

ファイル名は内容を明確に表現します。

```
// Good
UserProfile.tsx
useUserData.ts
validateEmail.ts

// Bad
comp1.tsx
utils.ts
helpers.ts
```

---

## ファイルの配置ルール

### 配置先の判断フロー

```
1. Next.jsの特別なファイル？
   YES → app/ に配置
   NO  → 次へ

2. 外部ライブラリの設定・ラッパー？
   YES → lib/ に配置
   NO  → 次へ

3. 特定の機能に関連？
   YES → その機能でのみ使用？
         YES → features/[feature-name]/ に配置
         NO  → shared/ に配置（2つ以上の機能で使用）
   NO  → shared/ に配置（汎用コード）
```

### 具体例

| ファイル                      | 配置場所                    | 理由                         |
| ----------------------------- | --------------------------- | ---------------------------- |
| LoginForm.tsx                 | features/auth/components/   | 認証機能固有のコンポーネント |
| Button.tsx                    | shared/components/ui/       | 汎用 UI コンポーネント       |
| useRecruitmentForm.ts         | features/recruitment/hooks/ | 求人機能固有のフック         |
| useDebounce.ts                | shared/hooks/               | 汎用フック                   |
| validate-salary.ts            | features/recruitment/utils/ | 求人固有のバリデーション     |
| format-date.ts                | shared/utils/               | 汎用ユーティリティ           |
| recruitment-types.ts          | features/recruitment/types/ | 求人固有の型定義             |
| api-types.ts                  | shared/types/               | API 共通の型定義             |
| page.tsx                      | app/(private)/dashboard/    | Next.js ページファイル       |
| client.ts（API クライアント） | lib/api/                    | 外部ライブラリのラッパー     |

詳細なディレクトリ構成については [ディレクトリ構成ルール](./directory.md) を参照してください。

---

## コロケーション（Colocation）

### スタイルファイル

CSS Modules や Tailwind を使用する場合でも、必要に応じてコンポーネント専用のスタイルファイルを隣に配置できます。

```
features/auth/components/
├── LoginForm.tsx
└── LoginForm.module.css    # コンポーネント専用スタイル
```

### 関連するサブコンポーネント

大きなコンポーネントが複数のサブコンポーネントを持つ場合、サブディレクトリにまとめます。

```
features/recruitment/components/
└── RecruitmentCard/
    ├── index.tsx                # メインコンポーネント
    ├── Header.tsx               # サブコンポーネント
    ├── Body.tsx                 # サブコンポーネント
    └── Footer.tsx               # サブコンポーネント
```

エクスポートは `index.tsx` で行い、外部からは `RecruitmentCard` として使用できるようにします。

```typescript
// features/recruitment/components/RecruitmentCard/index.tsx
import { Header } from "./Header";
import { Body } from "./Body";
import { Footer } from "./Footer";

export function RecruitmentCard() {
  return (
    <div>
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

// 使用側
import { RecruitmentCard } from "@/features/recruitment/components/RecruitmentCard";
```

---

## ファイル分割の基準

### いつファイルを分割するか

以下のいずれかに該当する場合、ファイルを分割します。

1. **行数が 200〜300 行を超えた場合**

   - コンポーネント: サブコンポーネントに分割
   - ユーティリティ: 機能ごとに分割
   - 型定義: ドメインごとに分割

2. **複数の責務が混在している場合**

   ```typescript
   // Bad: バリデーションとフォーマットが混在
   // utils/user.ts
   export function validateEmail() { ... }
   export function formatUserName() { ... }

   // Good: 責務ごとに分割
   // utils/validate-email.ts
   export function validateEmail() { ... }

   // utils/format-user-name.ts
   export function formatUserName() { ... }
   ```

3. **再利用可能な部分がある場合**

   ```typescript
   // 大きなコンポーネントから再利用可能な部分を抽出
   // Before:
   features/recruitment/components/RecruitmentForm.tsx (500行)

   // After:
   features/recruitment/components/RecruitmentForm.tsx (200行)
   features/recruitment/components/JobTypeSelector.tsx (100行) # 抽出
   features/recruitment/components/SalaryInput.tsx (100行)     # 抽出
   ```

### ファイル分割の例

#### Before: 1 つの大きなファイル

```typescript
// features/recruitment/utils/recruitment-helpers.ts (500行)
export function validateSalary() { ... }
export function validateJobTitle() { ... }
export function formatSalary() { ... }
export function formatJobType() { ... }
export function calculateSalaryRange() { ... }
```

#### After: 責務ごとに分割

```
features/recruitment/utils/
├── validate-salary.ts       # バリデーション
├── validate-job-title.ts    # バリデーション
├── format-salary.ts         # フォーマット
├── format-job-type.ts       # フォーマット
└── calculate-salary-range.ts # 計算ロジック
```

---

## index.ts によるエクスポート集約

### 基本的な使い方

各ディレクトリに `index.ts` を配置し、エクスポートを集約します。

```typescript
// features/auth/components/index.ts
export { LoginForm } from "./LoginForm";
export { RegisterForm } from "./RegisterForm";
export { PasswordResetForm } from "./PasswordResetForm";

// 使用側
import { LoginForm, RegisterForm } from "@/features/auth/components";
```

### index.ts のメリット

1. **インポートパスの簡潔化**

   ```typescript
   // Before
   import { LoginForm } from "@/features/auth/components/LoginForm";
   import { RegisterForm } from "@/features/auth/components/RegisterForm";

   // After
   import { LoginForm, RegisterForm } from "@/features/auth/components";
   ```

2. **内部構造の隠蔽**

   ディレクトリ内部のファイル構成を変更しても、外部への影響を最小限にできます。

3. **公開 API の明確化**

   `index.ts` でエクスポートされているものだけが公開 API となります。

### index.ts を使うべき場所

- `features/[feature-name]/components/index.ts`
- `features/[feature-name]/hooks/index.ts`
- `shared/components/ui/index.ts`
- `shared/hooks/index.ts`
- `shared/utils/index.ts`

### index.ts を避けるべき場所

- `app/` ディレクトリ（Next.js のルーティングに影響）
- 循環依存を引き起こす可能性がある場所

---

## ベストプラクティス

### 1. ファイルサイズを適切に保つ

- コンポーネント: 200 行以内
- フック: 100 行以内
- ユーティリティ関数: 50 行以内（1 関数あたり）
- 型定義: 機能ごとに分割

### 2. 一貫性のある命名

```
// コンポーネント: PascalCase
LoginForm.tsx
RecruitmentCard.tsx

// フック: camelCase（useプレフィックス）
useAuth.ts
useRecruitmentForm.ts

// ユーティリティ: kebab-case
format-date.ts
validate-email.ts

// 型定義: kebab-case（-types サフィックス）
auth-types.ts
recruitment-types.ts

// 定数: kebab-case（.constants サフィックス）
api.constants.ts
validation.constants.ts
```

詳細は [命名規則](./naming.md) を参照してください。

### 3. プライベートフォルダの活用（Next.js）

`_` プレフィックスを付けたフォルダは Next.js のルーティング対象外になります。

```
app/
├── _components/       # ルーティング対象外（app内で共有するコンポーネント）
├── _utils/            # ルーティング対象外（app内で共有するユーティリティ）
└── dashboard/         # ルーティング対象（/dashboard）
    ├── _components/   # ルーティング対象外（dashboardページ専用コンポーネント）
    └── page.tsx
```

### 4. 浅い階層を保つ

ディレクトリの階層は 3〜4 レベル程度に抑えます。

```
// Good: 3レベル
features/auth/components/LoginForm.tsx

// Bad: 深すぎる（6レベル）
features/auth/ui/forms/authentication/login/LoginForm.tsx
```

### 5. 関連ファイルをグループ化

関連するファイルは同じディレクトリにまとめます。

```
features/recruitment/components/RecruitmentCard/
├── index.tsx                  # メインコンポーネント
├── Header.tsx                 # サブコンポーネント
├── Body.tsx                   # サブコンポーネント
└── Footer.tsx                 # サブコンポーネント
```

### 6. 循環依存を避ける

`index.ts` や相互インポートによる循環依存を避けます。

```typescript
// Bad: 循環依存
// features/auth/components/index.ts
export * from "./LoginForm";
export * from "./RegisterForm";

// features/auth/hooks/useAuth.ts
import { LoginForm } from "../components"; // → components/index.ts
// LoginForm が useAuth をインポート → 循環依存

// Good: 直接インポート
import { LoginForm } from "../components/LoginForm";
```

---

## チェックリスト

新しいファイルを作成する際は、以下を確認してください。

- [ ] ファイル名は内容を明確に表現している
- [ ] 適切なディレクトリに配置されている
- [ ] ファイルの行数が適切（コンポーネント: 200 行以内）
- [ ] 単一責任の原則に従っている
- [ ] 関連するファイルは近くに配置されている
- [ ] 必要に応じて `index.ts` でエクスポートを集約している
- [ ] 循環依存を引き起こしていない

---

## 関連ドキュメント

- [ディレクトリ構成ルール](./directory.md)
- [命名規則](./naming.md)
- [TypeScript コーディング規約](./typescript.md)
