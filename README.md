# Next.js Directory Design Sample

Next.js プロジェクトのディレクトリ構成のサンプルリポジトリです。

## 概要

このリポジトリは、スケーラブルで保守性の高い Next.js アプリケーションを構築するためのディレクトリ構成のベストプラクティスを示すことを目的としています。

## 技術スタック

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Linter/Formatter**: [Biome](https://biomejs.dev/)
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## プロジェクト構成

```
nextjs_directory_design/
├── src/
│   └── app/          # App Routerのルーティング
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── public/           # 静的ファイル
└── ...
```

## セットアップ

### 依存関係のインストール

```bash
yarn install
```

### 開発サーバーの起動

```bash
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## このプロジェクトについて

このプロジェクトは以下の設定で `create-next-app` を使用して作成されました：

```bash
npx create-next-app@latest .
✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? … Yes
✔ Which linter would you like to use? › Biome
✔ Would you like to use React Compiler? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the import alias (`@/*` by default)? … Yes
✔ What import alias would you like configured? … @/*
```

## 参考リソース

- [Next.js Documentation](https://nextjs.org/docs) - Next.js の機能と API について
- [Next.js Learn](https://nextjs.org/learn) - インタラクティブな Next.js チュートリアル
- [Biome Documentation](https://biomejs.dev/) - Biome の使い方
