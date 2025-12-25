# データフェッチ戦略

このドキュメントでは、Next.js App Router におけるデータフェッチ戦略と、
Server Components と Client Components の使い分け方針について説明します。

## 目次

- [概要](#概要)
- [Server Components と Client Components の違い](#server-components-と-client-components-の違い)
- [使い分けの判断基準](#使い分けの判断基準)
- [Server Components でのデータフェッチ](#server-components-でのデータフェッチ)
- [Client Components でのデータフェッチ](#client-components-でのデータフェッチ)
- [データフェッチパターン](#データフェッチパターン)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [ベストプラクティス](#ベストプラクティス)

---

## 概要

Next.js App Router では、デフォルトで Server Components が使用されます。これにより、以下のメリットが得られます：

- **初期ロード時間の短縮**: JavaScript バンドルサイズの削減
- **SEO の向上**: サーバーサイドでレンダリングされた完全な HTML
- **セキュリティ**: API キーやトークンをクライアントに公開しない
- **データフェッチの効率化**: データソースに直接アクセス可能

一方、Client Components はインタラクティブな機能に必要です。
適切に使い分けることで、パフォーマンスとユーザー体験を最適化できます。

---

## Server Components と Client Components の違い

### Server Components（デフォルト）

**特徴**:

- サーバー上でのみ実行される
- クライアントに JavaScript を送信しない
- データベースやファイルシステムに直接アクセス可能
- 環境変数や API キーを安全に使用できる

**できること**:

```typescript
// Server Component
export default async function UserProfile({ userId }: { userId: string }) {
  // データベースに直接アクセス
  const user = await db.user.findUnique({ where: { id: userId } });

  // APIキーを安全に使用
  const externalData = await fetch("https://api.example.com", {
    headers: { Authorization: `Bearer ${process.env.API_KEY}` },
  });

  return (
    <div>
      <h1>{user.name}</h1>
      {/* ... */}
    </div>
  );
}
```

**できないこと**:

- `useState`, `useEffect` などの React Hooks の使用
- イベントハンドラ（`onClick`, `onChange` など）の使用
- ブラウザ専用 API（`localStorage`, `window` など）へのアクセス

### Client Components（`"use client"` 指定）

**特徴**:

- ブラウザで実行される
- インタラクティブな機能を提供
- React の状態管理と副作用を使用可能
- JavaScript バンドルに含まれる

**できること**:

```typescript
"use client";

import { useState, useEffect } from "react";

export default function SearchForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    // ブラウザでデータフェッチ
    if (query) {
      fetch(`/api/search?q=${query}`)
        .then((res) => res.json())
        .then(setResults);
    }
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {/* ... */}
    </div>
  );
}
```

**できないこと**:

- データベースへの直接アクセス
- サーバー専用モジュールの使用（`fs`, `path` など）

### 比較表

| 項目                 | Server Components      | Client Components                  |
| -------------------- | ---------------------- | ---------------------------------- |
| 実行場所             | サーバー               | ブラウザ                           |
| デフォルト           | ✅ はい                | ❌ いいえ（`"use client"` が必要） |
| React Hooks          | ❌ 不可                | ✅ 可能                            |
| イベントハンドラ     | ❌ 不可                | ✅ 可能                            |
| データベースアクセス | ✅ 可能                | ❌ 不可                            |
| JavaScript バンドル  | ❌ 含まれない          | ✅ 含まれる                        |
| SEO                  | ✅ 優れている          | ⚠️ 初期レンダリングは空            |
| データフェッチ       | `async/await` 直接使用 | `useEffect`, SWR, React Query      |

---

## 使い分けの判断基準

### Server Components を使用する場合

以下のいずれかに該当する場合は、Server Components を優先します：

1. **データフェッチが必要**

   - データベースやファイルシステムへのアクセス
   - 外部 API の呼び出し（認証トークン含む）
   - サーバー専用のライブラリを使用

2. **静的コンテンツの表示**

   - ブログ記事、商品詳細など
   - ユーザーインタラクションが不要

3. **SEO が重要**

   - 検索エンジンにインデックスされるコンテンツ
   - OGP メタタグの動的生成

4. **セキュリティが重要**
   - API キーやシークレットを使用
   - 機密情報の処理

**例**:

```typescript
// app/(private)/recruitment/page.tsx
// Server Component（デフォルト）
export default async function RecruitmentPage() {
  // サーバーでデータフェッチ
  const recruitments = await getRecruitments();

  return (
    <div>
      <h1>求人一覧</h1>
      <RecruitmentList data={recruitments} />
    </div>
  );
}
```

### Client Components を使用する場合

以下のいずれかに該当する場合は、Client Components を使用します：

1. **インタラクティブ性が必要**

   - フォーム入力、ボタンクリック
   - ドラッグ&ドロップ、アニメーション
   - モーダル、トグル、タブ

2. **状態管理が必要**

   - ローカル状態（`useState`）
   - グローバル状態（Zustand, Redux）

3. **副作用が必要**

   - `useEffect` でのデータフェッチ
   - イベントリスナーの登録
   - タイマーやインターバル

4. **ブラウザ API の使用**
   - `localStorage`, `sessionStorage`
   - `window`, `document`
   - Geolocation API など

**例**:

```typescript
"use client";

import { useState } from "react";

// Client Component
export default function SearchForm() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 検索処理
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">検索</button>
    </form>
  );
}
```

### 組み合わせパターン

Server Components と Client Components を組み合わせることで、最適なパフォーマンスを実現できます。

```typescript
// app/(private)/recruitment/page.tsx
// Server Component
export default async function RecruitmentPage() {
  // サーバーでデータフェッチ
  const recruitments = await getRecruitments();

  return (
    <div>
      <h1>求人一覧</h1>
      {/* Server Component */}
      <RecruitmentList data={recruitments} />
      {/* Client Component */}
      <SearchForm />
    </div>
  );
}

// features/recruitment/components/RecruitmentList.tsx
// Server Component（インタラクティブ性なし）
export function RecruitmentList({ data }: { data: Recruitment[] }) {
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <RecruitmentCard data={item} />
        </li>
      ))}
    </ul>
  );
}

// features/recruitment/components/RecruitmentCard.tsx
("use client");

// Client Component（いいねボタンなどのインタラクション）
export function RecruitmentCard({ data }: { data: Recruitment }) {
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <h3>{data.title}</h3>
      <button onClick={() => setLiked(!liked)}>{liked ? "♥" : "♡"}</button>
    </div>
  );
}
```

---

## Server Components でのデータフェッチ

### 基本的なデータフェッチ

Server Components では、`async/await` を使用してデータを直接フェッチできます。

```typescript
// app/(private)/messages/page.tsx
export default async function MessagesPage() {
  // データベースから直接取得
  const messages = await db.message.findMany({
    where: { userId: "current-user-id" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1>メッセージ</h1>
      <MessageList messages={messages} />
    </div>
  );
}
```

### 並列データフェッチ

複数のデータソースから同時にフェッチして、パフォーマンスを向上させます。

```typescript
// app/(private)/dashboard/page.tsx
export default async function DashboardPage() {
  // 並列でデータフェッチ
  const [stats, recentMessages, upcomingShifts] = await Promise.all([
    getStats(),
    getRecentMessages(),
    getUpcomingShifts(),
  ]);

  return (
    <div>
      <Stats data={stats} />
      <RecentMessages data={recentMessages} />
      <UpcomingShifts data={upcomingShifts} />
    </div>
  );
}
```

### シーケンシャルデータフェッチ

前のデータに依存する場合は、順番にフェッチします。

```typescript
// app/(private)/recruitment/[id]/page.tsx
export default async function RecruitmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 1. 求人情報を取得
  const recruitment = await getRecruitment(params.id);

  // 2. 求人に関連する応募者情報を取得
  const applications = await getApplications(recruitment.id);

  return (
    <div>
      <RecruitmentDetail data={recruitment} />
      <ApplicationList data={applications} />
    </div>
  );
}
```

### エラーハンドリング

```typescript
// app/(private)/recruitment/page.tsx
export default async function RecruitmentPage() {
  try {
    const recruitments = await getRecruitments();

    return (
      <div>
        <RecruitmentList data={recruitments} />
      </div>
    );
  } catch (error) {
    // error.tsx で自動的にキャッチされる
    throw error;
  }
}
```

### データキャッシング

Next.js はデフォルトで `fetch` のレスポンスをキャッシュします。

#### キャッシュ戦略の選択

適切なキャッシュ戦略を選択することで、パフォーマンスとデータの鮮度のバランスを最適化できます。

| 方法                   | 動作                                        | 用途                                           |
| ---------------------- | ------------------------------------------- | ---------------------------------------------- |
| `force-cache` + `tags` | `revalidateTag` で手動クリア → 再キャッシュ | **推奨**: 投稿・更新時に最新化したい           |
| `no-store`             | 常にフェッチ、キャッシュなし                | 常に最新データが必要（リアルタイムデータなど） |
| `revalidate: 60`       | 60 秒ごとに自動再検証                       | 定期的に更新されるコンテンツ                   |

#### revalidateTag を使った手動キャッシュ制御（推奨）

`revalidateTag` は、データ更新時に関連するキャッシュを効率的にクリアする仕組みです。

**重要なポイント**:

- `revalidateTag` はキャッシュを永続的に無効化しません
- 該当タグのキャッシュを一度だけクリアし、次のリクエストで再フェッチ → 再キャッシュされます
- 投稿・更新 API と一覧ページの組み合わせに最適

**実装例**:

ページ側（データ取得）:

```typescript
// app/(private)/messages/page.tsx
export default async function MessagesPage() {
  const res = await fetch("http://localhost:3000/api/messages", {
    next: { tags: ["messages"] },
    cache: "force-cache",
  });

  const messages = await res.json();
  return <MessageList messages={messages} />;
}
```

API 側（更新 + キャッシュクリア）:

```typescript
// app/api/messages/route.ts
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();

  // データベースに保存
  await db.message.create({ data: body });

  // 'messages' タグのキャッシュを一度だけクリア
  // 次のリクエストで再フェッチされ、新しいデータがキャッシュされる
  revalidateTag("messages", {});

  return Response.json({ success: true });
}
```

**動作の流れ**:

1. 初回アクセス時: データをフェッチし、`'messages'` タグでキャッシュ
2. POST リクエスト: データを作成し、`revalidateTag('messages')` でキャッシュをクリア
3. 次回アクセス時: キャッシュがないため再フェッチし、新しいデータをキャッシュ
4. 以降のアクセス: キャッシュされたデータを返す（POST されるまで）

#### その他のキャッシュ戦略

```typescript
// 常に最新データを取得（キャッシュなし）
const data = await fetch("https://api.example.com/data", {
  cache: "no-store",
});

// 60秒間キャッシュ（時間ベースの再検証）
const data = await fetch("https://api.example.com/data", {
  next: { revalidate: 60 },
});

// 永続的にキャッシュ（デフォルト）
const data = await fetch("https://api.example.com/data", {
  cache: "force-cache",
});
```

### データベース直接アクセス

```typescript
// lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// app/(private)/users/page.tsx
import { db } from "@/lib/db";

export default async function UsersPage() {
  const users = await db.user.findMany();

  return <UserList users={users} />;
}
```

---

## Client Components でのデータフェッチ

### useState + useEffect パターン

基本的なデータフェッチパターンです。

```typescript
"use client";

import { useState, useEffect } from "react";

export function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages");
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {messages.map((message) => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
}
```

### SWR を使用したデータフェッチ（推奨）

SWR は、キャッシング、再検証、エラーハンドリングを自動で行います。

```typescript
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MessageList() {
  const { data, error, isLoading } = useSWR("/api/messages", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((message: Message) => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
}
```

### React Query を使用したデータフェッチ

React Query は、より高度なキャッシングと状態管理を提供します。

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";

export function MessageList() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await fetch("/api/messages");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    staleTime: 5000, // 5秒間は新鮮とみなす
    refetchInterval: 30000, // 30秒ごとに再フェッチ
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((message: Message) => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
}
```

### Mutation（データ更新）

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CreateMessageForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newMessage: { text: string }) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
      return response.json();
    },
    onSuccess: () => {
      // メッセージ一覧を再フェッチ
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;
    mutation.mutate({ text });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="text" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "送信中..." : "送信"}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}
```

---

## データフェッチパターン

### パターン 1: Server Component でフェッチ + Props 渡し

最もシンプルで推奨されるパターンです。

```typescript
// app/(private)/recruitment/page.tsx
// Server Component
export default async function RecruitmentPage() {
  const recruitments = await getRecruitments();

  return <RecruitmentList data={recruitments} />;
}

// features/recruitment/components/RecruitmentList.tsx
("use client");

export function RecruitmentList({ data }: { data: Recruitment[] }) {
  const [filter, setFilter] = useState("");

  const filtered = data.filter((item) => item.title.includes(filter));

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="検索..."
      />
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### パターン 2: API Route + Client Component

クライアント側で動的にデータを取得する場合に使用します。

```typescript
// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const messages = await db.message.findMany();
  return NextResponse.json(messages);
}

// features/messages/components/MessageList.tsx
("use client");

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MessageList() {
  const { data, error } = useSWR("/api/messages", fetcher);

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <ul>
      {data.map((message: Message) => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
}
```

### パターン 3: 初期データ + クライアント更新

Server Component で初期データを取得し、Client Component で更新します。

```typescript
// app/(private)/messages/page.tsx
export default async function MessagesPage() {
  const initialMessages = await getMessages();

  return <MessageList initialData={initialMessages} />;
}

// features/messages/components/MessageList.tsx
("use client");

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MessageList({ initialData }: { initialData: Message[] }) {
  const { data = initialData } = useSWR("/api/messages", fetcher, {
    fallbackData: initialData,
    refreshInterval: 5000, // 5秒ごとに自動更新
  });

  return (
    <ul>
      {data.map((message) => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
}
```

### パターン 4: Suspense + Streaming

複数のデータを並行して読み込み、準備できた部分から表示します。

```typescript
// app/(private)/dashboard/page.tsx
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div>
      <h1>ダッシュボード</h1>

      <Suspense fallback={<div>統計情報を読み込み中...</div>}>
        <Stats />
      </Suspense>

      <Suspense fallback={<div>メッセージを読み込み中...</div>}>
        <RecentMessages />
      </Suspense>

      <Suspense fallback={<div>シフトを読み込み中...</div>}>
        <UpcomingShifts />
      </Suspense>
    </div>
  );
}

// 各コンポーネントは独立してデータフェッチ
async function Stats() {
  const stats = await getStats();
  return <StatsDisplay data={stats} />;
}

async function RecentMessages() {
  const messages = await getRecentMessages();
  return <MessageList data={messages} />;
}

async function UpcomingShifts() {
  const shifts = await getUpcomingShifts();
  return <ShiftList data={shifts} />;
}
```

---

## パフォーマンス最適化

### 1. 適切なキャッシング戦略

**推奨: `revalidateTag` を使った手動キャッシュ制御**

データ更新が発生するアプリケーションでは、`revalidateTag` を使った手動キャッシュ制御が最も効率的です。

```typescript
// ページ側: タグ付きでキャッシュ
const messages = await fetch("http://localhost:3000/api/messages", {
  next: { tags: ["messages"] },
  cache: "force-cache",
});

// API側: データ更新時にキャッシュをクリア
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  await db.message.create({ data: body });
  revalidateTag("messages", {}); // 関連キャッシュをクリア
  return Response.json({ success: true });
}
```

**その他のキャッシュ戦略**

```typescript
// 静的データ（商品情報など）: 永続キャッシュ
const products = await fetch("https://api.example.com/products", {
  cache: "force-cache",
});

// リアルタイムデータ（株価、天気など）: キャッシュなし
const weather = await fetch("https://api.example.com/weather", {
  cache: "no-store",
});

// 定期更新データ（ニュースなど）: 時間ベース再検証
const news = await fetch("https://api.example.com/news", {
  next: { revalidate: 3600 }, // 1時間ごとに再検証
});
```

### 2. データの並列フェッチ

```typescript
// Bad: シーケンシャル（遅い）
export default async function Page() {
  const user = await getUser();
  const posts = await getPosts();
  const comments = await getComments();

  return <div>...</div>;
}

// Good: 並列（速い）
export default async function Page() {
  const [user, posts, comments] = await Promise.all([
    getUser(),
    getPosts(),
    getComments(),
  ]);

  return <div>...</div>;
}
```

### 3. Streaming と Suspense の活用

```typescript
// app/(private)/recruitment/page.tsx
import { Suspense } from "react";

export default function RecruitmentPage() {
  return (
    <div>
      {/* すぐに表示 */}
      <h1>求人一覧</h1>

      {/* データ読み込み中はローディング表示 */}
      <Suspense fallback={<RecruitmentListSkeleton />}>
        <RecruitmentList />
      </Suspense>
    </div>
  );
}

async function RecruitmentList() {
  const recruitments = await getRecruitments();
  return <RecruitmentCards data={recruitments} />;
}
```

### 4. データの最小化

```typescript
// Bad: 不要なデータも取得
const user = await db.user.findUnique({
  where: { id: userId },
});

// Good: 必要なフィールドのみ取得
const user = await db.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
  },
});
```

### 5. React Query / SWR のキャッシュ活用

```typescript
"use client";

import useSWR from "swr";

export function UserProfile({ userId }: { userId: string }) {
  const { data } = useSWR(`/api/users/${userId}`, fetcher, {
    // 5分間は再フェッチしない
    dedupingInterval: 5 * 60 * 1000,
    // フォーカス時に再検証しない
    revalidateOnFocus: false,
  });

  return <div>{data?.name}</div>;
}
```

---

## ベストプラクティス

### 1. デフォルトは Server Components

```typescript
// Good: デフォルトで Server Component
export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}

// Bad: 不要な Client Component
("use client");

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{data}</div>;
}
```

### 2. Client Components は末端に配置

```typescript
// Good: Client Component を末端に
// app/page.tsx - Server Component
export default async function Page() {
  const data = await getData();

  return (
    <div>
      <Header />
      <MainContent data={data} />
      <InteractiveButton /> {/* Client Component */}
    </div>
  );
}

// Bad: Client Component をトップレベルに
// app/page.tsx
("use client");

export default function Page() {
  // この配下のすべてが Client Component になってしまう
  return (
    <div>
      <Header />
      <MainContent />
      <InteractiveButton />
    </div>
  );
}
```

### 3. Props でデータを渡す

```typescript
// Good: Server Component でフェッチ → Props で渡す
// app/page.tsx - Server Component
export default async function Page() {
  const data = await getData();
  return <ClientComponent data={data} />;
}

// features/example/components/ClientComponent.tsx
("use client");

export function ClientComponent({ data }: { data: Data }) {
  const [filter, setFilter] = useState("");
  // data を使ってインタラクティブな処理
  return <div>...</div>;
}

// Bad: Client Component 内でフェッチ
("use client");

export function ClientComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>...</div>;
}
```

### 4. API Routes の適切な使用

```typescript
// Good: データ更新 + キャッシュクリア（推奨）
// app/api/messages/route.ts
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const message = await createMessage(body);

  // 関連するキャッシュをクリア
  revalidateTag("messages", {});

  return Response.json(message);
}

// Bad: Server Component で直接実行できる処理
// app/api/messages/route.ts
export async function GET() {
  // これは Server Component で直接実行すべき
  const messages = await db.message.findMany();
  return Response.json(messages);
}
```

### 5. エラーハンドリングの実装

```typescript
// app/(private)/recruitment/page.tsx
export default async function RecruitmentPage() {
  try {
    const recruitments = await getRecruitments();
    return <RecruitmentList data={recruitments} />;
  } catch (error) {
    // error.tsx が自動的にキャッチ
    throw error;
  }
}

// app/(private)/recruitment/error.tsx
("use client");

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <button onClick={reset}>再試行</button>
    </div>
  );
}
```

### 6. ローディング状態の提供

```typescript
// app/(private)/recruitment/loading.tsx
export default function Loading() {
  return (
    <div>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-32 bg-gray-200 rounded mb-2" />
        <div className="h-32 bg-gray-200 rounded mb-2" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
```

### 7. TypeScript の型安全性

```typescript
// types/recruitment.ts
export type Recruitment = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

// app/(private)/recruitment/page.tsx
export default async function RecruitmentPage() {
  // 型安全なデータフェッチ
  const recruitments: Recruitment[] = await getRecruitments();

  return <RecruitmentList data={recruitments} />;
}

// features/recruitment/components/RecruitmentList.tsx
export function RecruitmentList({ data }: { data: Recruitment[] }) {
  // TypeScript が型をチェック
  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}
```

---

## 参考資料

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [SWR Documentation](https://swr.vercel.app/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [App Router](./app-router.md)
- [状態管理](./state-management.md)
