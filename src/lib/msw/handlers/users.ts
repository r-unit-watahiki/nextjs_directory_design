import { HttpResponse, http } from 'msw';

/**
 * ユーザー関連のMSWハンドラー
 */
export const usersHandlers = [
  // TODO: GET /api/v1/users - ユーザー一覧取得
  http.get('/api/v1/users', () => {
    return HttpResponse.json({
      users: [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
      ],
    });
  }),

  // TODO: GET /api/v1/users/:id - ユーザー詳細取得
  // TODO: POST /api/v1/users - ユーザー作成
  // TODO: PUT /api/v1/users/:id - ユーザー更新
  // TODO: DELETE /api/v1/users/:id - ユーザー削除
];
