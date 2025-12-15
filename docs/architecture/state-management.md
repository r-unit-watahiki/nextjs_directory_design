# 状態管理

Next.js アプリケーションにおける状態管理のベストプラクティスとガイドラインです。

## 使用ライブラリ

- **Zustand**: グローバル状態管理
- **Zod**: バリデーションとスキーマ定義
- **React Hook Form**: フォーム状態管理

## 状態管理の基本原則

### 1. 状態の分類と使い分け

状態を適切に分類し、それぞれに適した管理方法を選択します。

```typescript
// サーバー状態 - APIから取得するデータ
// useState + useEffectまたはServer Componentsを使用
const [user, setUser] = useState<User | null>(null);
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);

// ローカルUI状態 - コンポーネント内でのみ使用
// useStateを使用
const [isOpen, setIsOpen] = useState(false);

// グローバルクライアント状態 - 複数コンポーネント間で共有
// Zustandを使用
const { theme, setTheme } = useThemeStore();

// URL状態 - URLパラメータやクエリパラメータ
// Next.jsのRouter機能を使用
const searchParams = useSearchParams();
const page = searchParams.get("page") || "1";

// フォーム状態 - フォーム入力の管理
// React Hook Formを使用
const { register, handleSubmit } = useForm<FormData>();
```

### 2. useState vs Zustand の使い分け

**useState を使用する場合:**

- 単一コンポーネント内でのみ使用する状態
- ライフサイクルがコンポーネントと紐づく一時的な状態
- モーダルの開閉、タブの選択など UI の一時的な状態

**Zustand を使用する場合:**

- 複数のコンポーネントで共有する状態
- アプリケーション全体で永続化する必要がある状態
- コンポーネントツリーを超えて状態を共有する必要がある場合

```typescript
// 悪い例: ローカルな状態をZustandで管理
const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

// 良い例: ローカルな状態はuseStateで管理
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  // ...
}

// 良い例: グローバルな状態はZustandで管理
const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

## サーバー状態管理

### useState + useEffect

API から取得するデータは、useState と useEffect を組み合わせて管理します。

```typescript
// src/hooks/api/useUser.ts
import { useState, useEffect } from "react";
import type { User } from "@/types/models/user";

export function useUser(userId: string) {
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const user = await response.json();

        if (!cancelled) {
          setData(user);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { data, isLoading, error };
}
```

### Server Components の活用

Server Components を使用すると、サーバー側でデータを取得できます。

```typescript
// app/users/[id]/page.tsx
import { User } from "@/types/models/user";

async function getUser(id: string): Promise<User> {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## クライアント状態管理

### useState（ローカル状態）

コンポーネント内でのみ使用する状態には useState を使用します。

```typescript
// 良い例: シンプルなローカル状態
function SearchBar() {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => setIsExpanded(false)}
      />
      {isExpanded && <SearchSuggestions query={query} />}
    </div>
  );
}
```

### useReducer（複雑なローカル状態）

複雑な状態ロジックには useReducer を使用します。

```typescript
type FilterState = {
  category: string | null;
  priceRange: [number, number];
  sortBy: "price" | "name" | "date";
  sortOrder: "asc" | "desc";
};

type FilterAction =
  | { type: "SET_CATEGORY"; payload: string | null }
  | { type: "SET_PRICE_RANGE"; payload: [number, number] }
  | {
      type: "SET_SORT";
      payload: { by: FilterState["sortBy"]; order: FilterState["sortOrder"] };
    }
  | { type: "RESET" };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_PRICE_RANGE":
      return { ...state, priceRange: action.payload };
    case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload.by,
        sortOrder: action.payload.order,
      };
    case "RESET":
      return initialFilterState;
    default:
      return state;
  }
}

const initialFilterState: FilterState = {
  category: null,
  priceRange: [0, 10000],
  sortBy: "date",
  sortOrder: "desc",
};

function ProductList() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  return (
    <div>
      <FilterPanel
        filters={filters}
        onCategoryChange={(category) =>
          dispatch({ type: "SET_CATEGORY", payload: category })
        }
        onPriceRangeChange={(range) =>
          dispatch({ type: "SET_PRICE_RANGE", payload: range })
        }
        onSortChange={(by, order) =>
          dispatch({ type: "SET_SORT", payload: { by, order } })
        }
        onReset={() => dispatch({ type: "RESET" })}
      />
      <ProductGrid filters={filters} />
    </div>
  );
}
```

### Zustand（グローバル状態）

複数のコンポーネントで共有する状態には Zustand を使用します。

#### 基本的な使用方法

```typescript
// src/stores/theme/themeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-storage",
    }
  )
);
```

```typescript
// 使用例
function ThemeToggleButton() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "ダークモード" : "ライトモード"}
    </button>
  );
}
```

#### 認証状態の管理

```typescript
// src/stores/auth/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/models/user";

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();
        set({ user: data.user });
      },

      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        set({ user: null });
      },

      checkSession: async () => {
        try {
          set({ isLoading: true });
          const response = await fetch("/api/auth/session");

          if (response.ok) {
            const data = await response.json();
            set({ user: data.user });
          }
        } catch (error) {
          console.error("Failed to check session:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // userのみ永続化
    }
  )
);
```

#### Store の分割

機能ごとに Store を分割します。

```typescript
// 悪い例: 全てを1つのStoreに詰め込む
type AppStore = {
  user: User | null;
  theme: Theme;
  notifications: Notification[];
  settings: Settings;
  // ...
};

// 良い例: 機能ごとに分割
// src/stores/auth/authStore.ts
// src/stores/theme/themeStore.ts
// src/stores/notifications/notificationStore.ts
// src/stores/settings/settingsStore.ts
```

#### Zustand のベストプラクティス

```typescript
// src/stores/cart/cartStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],

        addItem: (item) =>
          set((state) => {
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              state.items.push({ ...item, quantity: 1 });
            }
          }),

        removeItem: (id) =>
          set((state) => {
            state.items = state.items.filter((item) => item.id !== id);
          }),

        updateQuantity: (id, quantity) =>
          set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (item) {
              item.quantity = quantity;
            }
          }),

        clearCart: () => set({ items: [] }),

        total: () => {
          return get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        },
      })),
      {
        name: "cart-storage",
      }
    )
  )
);
```

## URL 状態管理

### Next.js Router

URL パラメータとクエリパラメータを活用します。

```typescript
// src/hooks/router/useQueryParams.ts
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useQueryParams<T extends Record<string, string>>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = Object.fromEntries(searchParams.entries()) as Partial<T>;

  const setParams = useCallback(
    (updates: Partial<T>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          newParams.set(key, String(value));
        } else {
          newParams.delete(key);
        }
      });

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearParams = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return { params, setParams, clearParams };
}
```

## フォーム状態管理

### React Hook Form + Zod

フォームには React Hook Form と Zod を使用します。

#### 基本的な使用方法

```typescript
// src/schemas/contact.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  message: z
    .string()
    .min(1, "メッセージは必須です")
    .max(500, "メッセージは500文字以内で入力してください"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

```typescript
// src/components/forms/ContactForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/schemas/contact";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }

      reset();
      alert("送信しました");
    } catch (error) {
      alert(error instanceof Error ? error.message : "送信に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">名前</label>
        <input
          id="name"
          {...register("name")}
          className="w-full rounded border p-2"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded border p-2"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message">メッセージ</label>
        <textarea
          id="message"
          {...register("message")}
          className="w-full rounded border p-2"
          rows={4}
        />
        {errors.message && (
          <p className="text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {isSubmitting ? "送信中..." : "送信"}
      </button>
    </form>
  );
}
```

#### デフォルト値の設定

```typescript
function UserEditForm({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio || "",
    },
  });

  // ...
}
```

#### ネストしたフィールド

```typescript
// src/schemas/profile.ts
import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().regex(/^\d{3}-\d{4}$/),
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
```

```typescript
function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  return (
    <form>
      <input {...register("name")} />
      <input {...register("email")} />
      <input {...register("address.street")} />
      <input {...register("address.city")} />
      <input {...register("address.zipCode")} />
      {errors.address?.street && <p>{errors.address.street.message}</p>}
    </form>
  );
}
```

#### カスタムバリデーション

```typescript
// src/schemas/user.ts
import { z } from "zod";

export const userSchema = z
  .object({
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });
```

### Server Actions との連携

```typescript
// app/actions/contact.ts
"use server";

import { contactSchema } from "@/schemas/contact";

export async function submitContact(data: unknown) {
  const validatedFields = contactSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // データベースに保存
  // await db.contact.create({ data: validatedFields.data });

  return { success: true };
}
```

```typescript
// src/components/forms/ContactForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/schemas/contact";
import { submitContact } from "@/app/actions/contact";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const result = await submitContact(data);

    if (result.success) {
      alert("送信しました");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>{/* フォームフィールド */}</form>
  );
}
```

## パフォーマンス最適化

### Zustand のセレクター

必要な状態のみを購読することで再レンダリングを最小化します。

```typescript
// 悪い例: Store全体を購読
function UserProfile() {
  const store = useAuthStore();
  return <div>{store.user?.name}</div>;
}

// 良い例: 必要な値のみ購読
function UserProfile() {
  const user = useAuthStore((state) => state.user);
  return <div>{user?.name}</div>;
}

// より良い例: 深い等価性チェック
import { shallow } from "zustand/shallow";

function UserProfile() {
  const { name, email } = useAuthStore(
    (state) => ({ name: state.user?.name, email: state.user?.email }),
    shallow
  );
  return (
    <div>
      {name} - {email}
    </div>
  );
}
```

### React Hook Form の最適化

```typescript
// 良い例: モード設定で検証タイミングを制御
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: "onBlur", // フォーカスが外れた時に検証
  reValidateMode: "onChange", // エラー後は入力毎に検証
});
```

## ベストプラクティス

### 1. 状態の最小化

派生可能な値は状態として持たず、計算します。

```typescript
// 悪い例: 派生値を状態として保持
const [items, setItems] = useState<Item[]>([]);
const [total, setTotal] = useState(0);

// 良い例（useState）: useMemoで計算
const [items, setItems] = useState<Item[]>([]);
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);

// 良い例（Zustand）: セレクター関数で計算
const total = useCartStore((state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
```

### 2. 状態更新の原則

状態更新は常にイミュータブルに行います。

```typescript
// 悪い例: ミューテーション
const addItem = (item: Item) => {
  items.push(item);
  setItems(items);
};

// 良い例（useState）: イミュータブルな更新
const addItem = (item: Item) => {
  setItems((prev) => [...prev, item]);
};

// 良い例（Zustand + Immer）: Immerで簡潔に
const useStore = create<Store>()(
  immer((set) => ({
    items: [],
    addItem: (item) =>
      set((state) => {
        state.items.push(item);
      }),
  }))
);
```

### 3. 適切なスコープの選択

状態は必要最小限のスコープで管理します。

```typescript
// ステップ1: まずローカル状態から始める
function Component() {
  const [value, setValue] = useState("");
  // ...
}

// ステップ2: 複数コンポーネントで必要になったらZustandへ
const useValueStore = create<Store>((set) => ({
  value: "",
  setValue: (value) => set({ value }),
}));
```

## まとめ

### 状態管理の選択基準

| 状態の種類                 | 使用ツール            | 理由                       |
| -------------------------- | --------------------- | -------------------------- |
| サーバー状態               | useState + useEffect  | データフェッチと同期       |
| Server Components          | async/await           | サーバー側でのデータ取得   |
| ローカル UI 状態           | useState              | コンポーネント内で完結     |
| 複雑なローカル状態         | useReducer            | 状態遷移が複雑             |
| グローバルクライアント状態 | Zustand               | 複数コンポーネント間で共有 |
| URL 状態                   | Next.js Router        | ブラウザの履歴と同期       |
| フォーム状態               | React Hook Form + Zod | バリデーションと型安全性   |

### 重要なポイント

- **useState**: ローカルで完結する状態に使用
- **Zustand**: グローバルに共有する必要がある状態に使用
- **React Hook Form**: フォームは必ず React Hook Form を使用
- **Zod**: バリデーションとスキーマ定義は必ず Zod を使用
- 状態は可能な限りローカルに保つ
- 派生値は状態として持たず計算する
- パフォーマンスを考慮してセレクターを活用する
