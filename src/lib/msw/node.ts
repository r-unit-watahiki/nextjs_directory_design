import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * Node.js環境用のMSWサーバー
 * テスト実行時にAPIモックを使用する際に利用
 */
export const server = setupServer(...handlers);

// TODO: テストのsetup/teardownでの起動・停止処理を追加
// TODO: テストごとのハンドラーリセット処理
// TODO: エラーハンドリングの設定
