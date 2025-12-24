# キャッシュ再検証（revalidateTag）のテスト手順

このドキュメントでは、Next.js の `revalidateTag` を使ったキャッシュ再検証機能のテスト方法を説明します。

## 概要

メッセージ機能を使って、以下の動作を確認します：

1. **Server Component** でデータフェッチ時に `tags: ['messages']` を設定
2. データはキャッシュされる
3. メッセージ投稿時に **API Route** で `revalidateTag('messages')` を実行
4. キャッシュが無効化され、次回リクエスト時に最新データを取得

## 前提条件

- NestJS APIサーバーが `http://localhost:3001` で起動している
- `/messages` エンドポイントが GET（一覧取得）と POST（作成）に対応している

## テスト手順

### 1. サーバーの起動

```bash
# Next.jsアプリを起動
npm run dev

# ブラウザで以下にアクセス
# http://localhost:3000/messages
```

### 2. キャッシュの確認（初回アクセス）

1. **ブラウザA**（Chrome）でメッセージ画面を開く
2. サーバーログを確認（ターミナル）
   - 初回はデータをフェッチ
   - データがキャッシュに保存される

```
# Next.jsサーバーのログ例
GET /messages 200 in 123ms
```

### 3. キャッシュヒットの確認（2回目のアクセス）

1. **ブラウザB**（Firefox or Chromeシークレットモード）で同じ画面を開く
2. サーバーログを確認
   - キャッシュからデータを返す
   - フェッチは発生しない（高速）

```
# キャッシュヒット時はログが出ない or 非常に高速
GET /messages 200 in 5ms (cache hit)
```

### 4. メッセージの投稿（revalidateTag の実行）

1. **ブラウザA** でメッセージを投稿
   - テキストエリアに「テストメッセージ」と入力
   - 「送信」ボタンをクリック

2. サーバーログを確認

```bash
# API Routeのログ
📝 メッセージ投稿を受信: { text: 'テストメッセージ', userId: 'user-1', ... }
✅ メッセージを作成しました: { id: '...', text: 'テストメッセージ', ... }
🔄 revalidateTag("messages") を実行...
✨ キャッシュ無効化完了！
```

### 5. キャッシュ再検証の確認（投稿後のアクセス）

1. **ブラウザB** で画面をリロード（F5）
2. 投稿したメッセージが表示されることを確認
3. サーバーログを確認
   - キャッシュが無効化されているため、再度フェッチが実行される

```
# キャッシュミス → 再フェッチ
GET /messages 200 in 145ms
```

### 6. 再度キャッシュされることを確認

1. **ブラウザC**（別のブラウザ or 新しいシークレットウィンドウ）で画面を開く
2. サーバーログを確認
   - ステップ5で再フェッチされたデータがキャッシュされている
   - キャッシュヒット

```
# 再度キャッシュから返される
GET /messages 200 in 3ms (cache hit)
```

## キャッシュの状態遷移

```
[ステップ1: 初回アクセス]
→ フェッチ → キャッシュ保存 → [キャッシュ: メッセージ3件]

[ステップ2: 2回目のアクセス]
→ キャッシュヒット → [キャッシュ: メッセージ3件]

[ステップ3: メッセージ投稿]
→ POST /api/messages
→ revalidateTag('messages')
→ [キャッシュ: 空]

[ステップ4: 投稿後のアクセス]
→ キャッシュミス → フェッチ → キャッシュ保存 → [キャッシュ: メッセージ4件]

[ステップ5: さらにアクセス]
→ キャッシュヒット → [キャッシュ: メッセージ4件]
```

## 確認ポイント

### ✅ 成功の条件

- [ ] 初回アクセス時にデータがフェッチされる
- [ ] 2回目以降はキャッシュから返される（高速）
- [ ] メッセージ投稿時に `revalidateTag` のログが出力される
- [ ] 投稿後のアクセスで最新データ（投稿したメッセージ含む）が表示される
- [ ] 別のブラウザでも最新データが表示される
- [ ] 再度キャッシュされる（次回アクセスは高速）

### ❌ 失敗のパターン

1. **投稿後も古いデータが表示される**
   - `revalidateTag` が実行されていない
   - タグ名が一致していない可能性

2. **常に新しいデータをフェッチしてしまう**
   - `cache: 'no-store'` が設定されている
   - キャッシュが正しく機能していない

3. **エラーが発生する**
   - NestJS APIサーバーが起動していない
   - ポート番号が異なる

## デバッグ方法

### Next.js のキャッシュを確認

```bash
# .next/cache ディレクトリを確認
ls -la .next/cache/fetch-cache/
```

### ログを詳細に確認

```bash
# Next.js の詳細ログを有効化
NODE_OPTIONS='--inspect' npm run dev
```

### キャッシュをクリア

```bash
# Next.js のキャッシュをクリア
rm -rf .next/cache
npm run dev
```

## トラブルシューティング

### Q1. キャッシュが無効化されない

**原因**: タグ名が一致していない

```typescript
// データフェッチ時
fetch('...', { next: { tags: ['messages'] } })  // ← タグ名

// キャッシュ無効化時
revalidateTag('messages')  // ← 同じタグ名にする
```

### Q2. 常に最新データが表示されてしまう

**原因**: キャッシュ設定が正しくない

```typescript
// ❌ キャッシュしない設定
fetch('...', { cache: 'no-store' })

// ✅ キャッシュする設定
fetch('...', { next: { tags: ['messages'] }, cache: 'force-cache' })
```

### Q3. API Route でエラーが発生

**原因**: NestJS APIサーバーが起動していない

```bash
# NestJS APIサーバーのポートを確認
curl http://localhost:3001/messages

# 起動していない場合は起動する
cd path/to/nestjs-api
npm run start:dev
```

## 関連ドキュメント

- [データフェッチ戦略](../architecture/data-fetching.md)
- [Next.js Revalidating Data](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data)
- [revalidateTag API Reference](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
