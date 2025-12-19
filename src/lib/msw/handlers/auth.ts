import { HttpResponse, http } from 'msw';

/**
 * 認証関連のMSWハンドラー
 */
export const authHandlers = [
  // TODO: POST /api/v1/auth/login - ログイン
  http.post('/api/v1/auth/login', () => {
    return HttpResponse.json({
      token: 'mock-token',
      user: { id: '1', email: 'test@example.com' },
    });
  }),

  // TODO: POST /api/v1/auth/logout - ログアウト
  // TODO: POST /api/v1/auth/register - 新規登録
  // TODO: POST /api/v1/auth/refresh - トークンリフレッシュ
  // TODO: GET /api/v1/auth/me - 現在のユーザー情報取得
];
