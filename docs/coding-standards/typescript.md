# TypeScript 規約

## 基本原則

- `any` 型の使用を避ける
- 型推論を活用し、不必要な型注釈は省略する
- `unknown` を `any` の代わりに使用する
- strict モードを有効にする

## 型定義の方法

### type vs interface

基本的に `type` を使用し、以下の場合のみ `interface` を使用する。

- ライブラリの公開 API を定義する場合
- Declaration Merging が必要な場合

```tsx
// Good: 通常は type を使用
type User = {
  id: string;
  name: string;
  email: string;
};

type UserWithRole = User & {
  role: "admin" | "user";
};

// interface を使う場合（Declaration Merging）
interface Window {
  myCustomProperty: string;
}
```

### プリミティブ型

- プリミティブのラッパー型（`String`、`Number`、`Boolean`）は使用しない
- 小文字の型（`string`、`number`、`boolean`）を使用する

```tsx
// Good
type UserId = string;
type Age = number;
type IsActive = boolean;

// Bad: ラッパー型は使わない
type UserId = String;
type Age = Number;
```

### オブジェクト型

```tsx
// Good: 読みやすい形式で定義
type User = {
  id: string;
  name: string;
  email: string;
  age?: number; // オプショナル
  readonly createdAt: Date; // 読み取り専用
};

// ネストしたオブジェクトは別の型として定義
type Address = {
  zipCode: string;
  prefecture: string;
  city: string;
};

type UserWithAddress = {
  id: string;
  name: string;
  address: Address;
};
```

### 配列型

配列の型注釈は `T[]` 形式を使用する（`Array<T>` は使わない）。

```tsx
// Good
type UserIds = string[];
type Users = User[];
type Matrix = number[][];

// Bad: Array<T> 形式は使わない
type UserIds = Array<string>;
type Users = Array<User>;
```

### Union 型

```tsx
// リテラル型のUnion（推奨）
type Status = "pending" | "approved" | "rejected";
type Role = "admin" | "editor" | "viewer";

// 複数の型のUnion
type Id = string | number;
type Response = SuccessResponse | ErrorResponse;

// 使用例
function getStatus(status: Status) {
  switch (status) {
    case "pending":
      return "処理中";
    case "approved":
      return "承認済み";
    case "rejected":
      return "却下";
  }
}
```

### Intersection 型

既存の型を組み合わせる場合に使用する。

```tsx
type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: string;
  name: string;
};

// Good: 既存の型を組み合わせる
type UserWithTimestamps = User & Timestamps;

// Bad: 同じプロパティを再定義しない
type UserWithTimestamps = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
```

## 型アサーション

型アサーションは必要最小限に留める。

```tsx
// Good: as const でリテラル型を推論
const COLORS = {
  primary: "#007bff",
  secondary: "#6c757d",
} as const;

type Color = (typeof COLORS)[keyof typeof COLORS];

// Good: 明確に型が分かっている場合のみ使用
const element = document.getElementById("app") as HTMLDivElement;

// Bad: any を経由した型アサーション（型安全性を損なう）
const user = data as any as User;

// Better: unknown を使用
const user = data as unknown as User;
```

### Non-null アサーション

`!` による Non-null アサーションは避け、適切なチェックを行う。

```tsx
// Bad: Non-null アサーションを使う
function getUser(id: string) {
  return users.find((u) => u.id === id)!;
}

// Good: 適切なチェック
function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

// Good: エラーハンドリング
function getUserOrThrow(id: string): User {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new Error(`User not found: ${id}`);
  }
  return user;
}
```

## ジェネリクス

### 基本的な使い方

```tsx
// 汎用的なデータ取得関数
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// 使用例
const userResponse = await fetchData<User>("/api/users/1");
const postsResponse = await fetchData<Post[]>("/api/posts");
```

### 制約付きジェネリクス

```tsx
// extends を使って型を制約
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: "1", name: "太郎" };
const name = getProperty(user, "name"); // OK
// const invalid = getProperty(user, "invalid"); // Error

// オブジェクト型を要求する制約
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
```

### デフォルト型パラメータ

```tsx
type ApiResponse<T = unknown> = {
  data: T;
  status: number;
};

// デフォルト型が使用される
const response: ApiResponse = {
  data: { message: "success" },
  status: 200,
};

// 明示的に型を指定
const userResponse: ApiResponse<User> = {
  data: { id: "1", name: "太郎" },
  status: 200,
};
```

## ユーティリティ型

TypeScript 組み込みのユーティリティ型を活用する。

### Partial と Required

```tsx
type User = {
  id: string;
  name: string;
  email: string;
  age: number;
};

// すべてのプロパティをオプショナルにする
type PartialUser = Partial<User>;

// 使用例: 更新用の型
function updateUser(id: string, updates: Partial<User>) {
  // ...
}

// すべてのプロパティを必須にする
type RequiredUser = Required<User>;
```

### Pick と Omit

```tsx
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

// 必要なプロパティのみを選択
type UserPublicInfo = Pick<User, "id" | "name" | "email">;

// 特定のプロパティを除外
type UserWithoutPassword = Omit<User, "password">;

// 使用例: レスポンス用の型
type UserResponse = Omit<User, "password">;
```

### Record

```tsx
// キーと値の型を定義
type UserRole = "admin" | "editor" | "viewer";

type RolePermissions = Record<
  UserRole,
  {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
  }
>;

const permissions: RolePermissions = {
  admin: { canRead: true, canWrite: true, canDelete: true },
  editor: { canRead: true, canWrite: true, canDelete: false },
  viewer: { canRead: true, canWrite: false, canDelete: false },
};
```

### ReturnType と Parameters

```tsx
function getUser(id: string) {
  return {
    id,
    name: "太郎",
    email: "taro@example.com",
  };
}

// 関数の戻り値の型を取得
type User = ReturnType<typeof getUser>;

// 関数の引数の型を取得
type GetUserParams = Parameters<typeof getUser>; // [string]
```

## 型ガード

### typeof 型ガード

```tsx
function printValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // string として扱われる
  } else {
    console.log(value.toFixed(2)); // number として扱われる
  }
}
```

### カスタム型ガード

```tsx
type User = {
  type: "user";
  id: string;
  name: string;
};

type Admin = {
  type: "admin";
  id: string;
  name: string;
  permissions: string[];
};

// 型述語を使ったカスタム型ガード
function isAdmin(user: User | Admin): user is Admin {
  return user.type === "admin";
}

function handleUser(user: User | Admin) {
  if (isAdmin(user)) {
    console.log(user.permissions); // Admin として扱われる
  } else {
    console.log(user.name); // User として扱われる
  }
}
```

### Discriminated Union

```tsx
type SuccessResponse = {
  status: "success";
  data: unknown;
};

type ErrorResponse = {
  status: "error";
  error: {
    message: string;
    code: number;
  };
};

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
  // status プロパティで型を判別
  if (response.status === "success") {
    console.log(response.data); // SuccessResponse として扱われる
  } else {
    console.log(response.error.message); // ErrorResponse として扱われる
  }
}
```

## 関数の型定義

### 関数の型注釈

```tsx
// Good: パラメータと戻り値の型を明示
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// Good: アロー関数
const calculateTotal = (price: number, quantity: number): number => {
  return price * quantity;
};

// 戻り値の型は推論に任せることも可能（明示的な方が推奨）
function greet(name: string) {
  return `Hello, ${name}`;
}
```

### オプショナルパラメータとデフォルトパラメータ

```tsx
// オプショナルパラメータ
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}`;
}

// デフォルトパラメータ（型推論される）
function greet(name: string, greeting = "Hello"): string {
  return `${greeting}, ${name}`;
}

// Rest パラメータ
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
```

### 関数型の定義

```tsx
// 関数型を type で定義
type CalculateFn = (a: number, b: number) => number;

const add: CalculateFn = (a, b) => a + b;
const subtract: CalculateFn = (a, b) => a - b;

// コールバック関数の型定義
type OnClick = (event: MouseEvent) => void;
type OnChange = (value: string) => void;
```

## 型の整理とエクスポート

### ファイル構成

```tsx
// src/types/user.ts
export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserRole = "admin" | "editor" | "viewer";

export type UserWithRole = User & {
  role: UserRole;
};

// src/types/index.ts
export type { User, UserRole, UserWithRole } from "./user";
export type { Post, PostStatus } from "./post";
```

### 型のインポート

```tsx
// Good: 型のみをインポートする場合は type を明示
import type { User } from "@/types";

// Good: 値と型を同時にインポート
import { useState, type FC } from "react";

// 複数の型をインポート
import type { User, Post, Comment } from "@/types";
```

## 避けるべきパターン

### enum の使用

`enum` の代わりに Union 型を使用する。

```tsx
// Bad: enum を使う
enum Status {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

// Good: Union 型を使う
type Status = "pending" | "approved" | "rejected";

// 定数が必要な場合は as const を使用
const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
```

### namespace の使用

`namespace` の代わりにモジュールを使用する。

```tsx
// Bad: namespace を使う
namespace User {
  export type Profile = {
    name: string;
  };
}

// Good: モジュールとして定義
// user.ts
export type UserProfile = {
  name: string;
};
```

## 型安全性のベストプラクティス

### 厳格な null チェック

```tsx
// Good: null/undefined を適切に処理
function getUserName(user: User | null | undefined): string {
  return user?.name ?? "Unknown";
}

// Good: Optional Chaining と Nullish Coalescing を活用
const userName = user?.profile?.name ?? "Anonymous";
```

### 型の絞り込み

```tsx
// Good: 適切な型の絞り込み
function processValue(value: string | number | null) {
  if (value === null) {
    return;
  }

  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```
