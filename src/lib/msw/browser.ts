import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * ブラウザ環境用のMSWワーカー
 * 開発環境でAPIモックを使用する際に利用
 */
export const worker = setupWorker(...handlers);

// TODO: 開発環境での自動起動設定を追加
// TODO: 環境変数による有効/無効の切り替え
// TODO: モック有効時のコンソール表示設定
