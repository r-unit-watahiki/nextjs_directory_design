# Biome 設定ドキュメント

このドキュメントでは、プロジェクトで使用している Biome（リンター・フォーマッター）の設定内容を説明します。

## 設定ファイル

- ファイルパス: `biome.json`
- Biome バージョン: 2.2.0

## 設定内容

### VCS (バージョン管理システム) 設定

```json
"vcs": {
  "enabled": true,
  "clientKind": "git",
  "useIgnoreFile": true
}
```

- **enabled**: Git 連携を有効化
- **clientKind**: Git を使用
- **useIgnoreFile**: `.gitignore`の設定を尊重し、無視されたファイルをチェック対象外にする

### ファイル設定

```json
"files": {
  "ignoreUnknown": true,
  "includes": ["**", "!node_modules", "!.next", "!dist", "!build"]
}
```

- **ignoreUnknown**: Biome が認識できないファイル形式を無視
- **includes**:
  - `**`: すべてのファイルを対象
  - `!node_modules`: 依存関係を除外
  - `!.next`: Next.js ビルド出力を除外
  - `!dist`: ディストリビューションフォルダを除外
  - `!build`: ビルドフォルダを除外

### フォーマッター設定

```json
"formatter": {
  "enabled": true,
  "indentStyle": "space",
  "indentWidth": 2,
  "lineWidth": 100
}
```

- **enabled**: フォーマッターを有効化
- **indentStyle**: スペースでインデント（タブではなく）
- **indentWidth**: インデント幅は 2 スペース
- **lineWidth**: 行の最大文字数を 100 文字

### JavaScript/TypeScript フォーマッター設定

```json
"javascript": {
  "formatter": {
    "quoteStyle": "single",
    "trailingCommas": "all",
    "semicolons": "always",
    "arrowParentheses": "always"
  }
}
```

- **quoteStyle**: `"single"` (シングルクォート)
  - JavaScript コミュニティで一般的、JSX 内のダブルクォートと区別しやすい
  - 例: `const name = 'John';`
- **trailingCommas**: `"all"` (すべての箇所に末尾カンマ)
  - Git の差分が綺麗になる、新しい行を追加しやすい
- **semicolons**: `"always"` (常に必須)
  - ASI（自動セミコロン挿入）の問題を回避
- **arrowParentheses**: `"always"` (常に括弧を使用)
  - 引数を追加する際の変更が最小限、一貫性を保つ
  - 例: `const fn = (x) => x * 2;`

### リンター設定

```json
"linter": {
  "enabled": true,
  "rules": {
    "recommended": true,
    "suspicious": {
      "noUnknownAtRules": "off"
    },
    "complexity": {
      "noExcessiveCognitiveComplexity": "warn"
    },
    "style": {
      "useImportType": "error",
      "useConst": "error",
      "noNegationElse": "warn"
    }
  },
  "domains": {
    "next": "recommended",
    "react": "recommended"
  }
}
```

- **enabled**: リンターを有効化
- **rules.recommended**: Biome の推奨ルールセットを適用
- **rules.suspicious.noUnknownAtRules**: CSS/SCSS 等の未知のアットルールを許可（オフ）
  - Tailwind CSS 等のカスタムディレクティブを使用する場合に必要

#### complexity（複雑度チェック）

- **noExcessiveCognitiveComplexity**: 複雑すぎる関数を警告
  - 保守性の向上、バグの防止に貢献

#### style（スタイルルール）

- **useImportType**: TypeScript の型インポート（`import type`）を強制
  ```typescript
  // Good
  import type { User } from './types';
  import { fetchUser } from './api';

  // Bad
  import { User, fetchUser } from './types';
  ```
  - **効果**: バンドルサイズ削減、型と値の明確な分離

- **useConst**: 再代入しない変数は `const` を使用
  ```typescript
  // Good
  const name = 'John';

  // Bad
  let name = 'John';
  ```

- **noNegationElse**: 否定条件の else 句を警告
  ```typescript
  // Good
  if (isValid) {
    // valid case
  } else {
    // invalid case
  }

  // Warn
  if (!isValid) {
    // invalid case
  } else {
    // valid case
  }
  ```

- **domains.next**: Next.js 固有の推奨ルールを適用
- **domains.react**: React 固有の推奨ルールを適用

### アシスト機能設定

```json
"assist": {
  "actions": {
    "source": {
      "organizeImports": "on"
    }
  }
}
```

- **organizeImports**: インポート文の自動整理を有効化
  - 未使用のインポートを削除
  - インポート文をアルファベット順にソート

## チェック内容

### 自動実行されるチェック

1. **コードフォーマット**

   - インデントの統一（2 スペース）
   - コードスタイルの一貫性

2. **リント検査**

   - Biome 推奨ルールセット
   - Next.js 固有のベストプラクティス
   - React のベストプラクティス
   - 複雑度チェック（認知的複雑性）
   - スタイルルール（型インポート、const 使用、否定条件の最適化）

3. **インポート整理**
   - 未使用インポートの検出・削除
   - インポート順序の整理

### 除外されているチェック

- `noUnknownAtRules`: CSS/SCSS の未知のアットルール（Tailwind CSS 等のカスタムディレクティブ対応のため）

## 使用方法

### チェック実行

```bash
# リント＆フォーマットチェック
npx biome check .

# 自動修正
npx biome check --write .
```

### CI/CD 連携

このプロジェクトでは、GitHub Actions で自動的に Biome チェックが実行されます。

## 関連ドキュメント

- [Biome 公式ドキュメント](https://biomejs.dev/)
- [Biome Configuration](https://biomejs.dev/reference/configuration/)
- [Biome Linter Rules](https://biomejs.dev/linter/rules/)
- [Biome Formatter Options](https://biomejs.dev/formatter/)
- [命名規則チェックリスト](./naming-conventions-checklist.md)
