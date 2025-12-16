# .ls-lint 設定確認パターン

`.ls-lint.yml` に定義したルールが期待通りに効いているかを確認するためのチェックリストです。各項目は「この名前なら合格する／この名前は失敗させたい」という両面のパターンを含めています。

## ディレクトリ命名（`.dir`）

- [ ] `src/app/order-history` や `src/features/user-settings` を作成すると警告が出ない（kebab-case 合格）
- [ ] `(dashboard)` や `_internal` ディレクトリを配置しても警告が出ない（route group / private 例外）
- [ ] `src/shared/UserSettings` のような PascalCase ディレクトリを追加すると lint が失敗する

## `src/app` 直下ファイル

- [ ] `src/app/page.tsx`, `layout.tsx`, `not-found.tsx` など Next.js 予約名が合格する
- [ ] `src/app/Dashboard.tsx` など PascalCase コンポーネントが合格する
- [ ] `src/app/foo.tsx` のような kebab-case .tsx は失敗する（PascalCase or Next.js 予約名のみ）
- [ ] `src/app/route.ts`, `middleware.ts`, `proxy.ts` が合格する
- [ ] `src/app/useAuthStore.ts`（Store）, `useQuery.ts`（hook）, `fetch-data.ts`（kebab-case）が合格する
- [ ] `src/app/fooBar.ts` のような camelCase .ts は失敗する
- [ ] `src/app/styles.css` は kebab-case なら合格し、`Styles.css` は失敗する

## `src/app` 配下のネスト構造

- [ ] `src/app/(admin)/users/page.tsx` などネストした route group でも Next.js 予約名または PascalCase だけが通る
- [ ] `src/app/(admin)/hooks/use-fetch.ts` のような kebab-case hook が失敗する（hook は `useXxx` 形式が必須）
- [ ] `src/app/(admin)/components/Header.tsx` は PascalCase で合格し、`header.tsx` は失敗する
- [ ] `_components` 配下の `useScroll.ts` や `scroll-lock.ts`、`index.ts` が合格し、`Scroll.ts`（PascalCase）や `ScrollLock.ts`（camelCase）が失敗する

## `src/features` 配下

- [ ] `src/features/cart/components/ProductCard.tsx`, `hooks/useCart.ts`, `stores/useCartStore.ts`, `utils/calc-tax.ts`, `index.ts` が合格する
- [ ] `src/features/cart/components/product-card.tsx`（kebab-case .tsx）や `stores/cartStore.ts`（camelCase store）が失敗する
- [ ] `src/features/cart/components/ProductCard.stories.tsx` が合格し、`product-card.stories.tsx` が失敗する
- [ ] `src/features/cart/hooks/index.ts` は合格し、`src/features/cart/hooks/fetchCart.ts`（camelCase hook）が失敗する
- [ ] `src/features/auth/hooks/useAuth.ts`, `stores/useAuthStore.ts`, `components/forms/LoginForm.tsx` のようにネストされたサブディレクトリでも同じ規則が適用される
- [ ] `src/features/auth/server/create-session.ts` のような kebab-case サーバーファイルは合格し、`createSession.ts` は失敗する

## `src/shared` 配下の個別ディレクトリ

- [ ] `src/shared/stores/useAuthStore.ts`, `hooks/useAuth.ts`, `components/Button.tsx`, `components/useScroll.ts`, `components/scroll-lock.ts`, `components/index.ts` が合格する
- [ ] `src/shared/types/user-type.ts`（`-type` suffix）や `user-types.ts` が合格し、`user.ts` は失敗する
- [ ] `src/shared/utils/format-date.ts` や `constants/api-endpoint.ts`, `styles/main.css` が合格する
- [ ] `src/shared/components/user-card.tsx`（kebab-case .tsx）と `src/shared/types/User.ts`（PascalCase 型名）を置くと失敗する
- [ ] `src/shared/components/forms/Input.tsx`, `hooks/dom/useScroll.ts`, `stores/auth/useAuthStore.ts` など features 同様にネストされたサブディレクトリでも規則が維持されることを確認する
- [ ] `src/shared/auth/server/create-session.ts` のような server ディレクトリ配下では kebab-case `.ts` のみ通り、`createSession.ts` は失敗する

## `src/lib` と `public`

- [ ] `src/lib/fetch-client.ts`, `src/lib/url-parser.ts` など kebab-case のみ合格し、`fetchClient.ts` は失敗する
- [ ] `public/service-worker` や `public/images/team-photo` など kebab-case ディレクトリが合格し、`public/TeamPhoto` が失敗する

## ルートおよび `src` 直下の汎用ルール

- [ ] ルート配下（例: `shared-config.ts`, `useAppStore.ts`, `useTheme.ts`, `fetch-config.ts`, `index.ts`）や `src` 直下でも同じパターンが適用されることを確認
- [ ] `README.md` のような kebab-case `.md` は合格し、`Docs.md` は失敗する
- [ ] `config.json` や `lint-config.js` は合格し、`Config.json` や `lintConfig.js` は失敗する
- [ ] PascalCase の `.tsx`（例: `AppShell.tsx`）は合格し、`app-shell.tsx` は失敗する

## ignore 対象

- [ ] `node_modules`, `.next`, `dist`, `build`, `.git`, `.vscode`, `coverage`, `.turbo`, `out` にテスト用ファイルを置いても lint に拾われない

## 参考コマンド

- `npx ls-lint`
  - チェックリストのファイルを出し入れしながら実行し、期待通りに PASS/FAIL が入れ替わるかを観察する
