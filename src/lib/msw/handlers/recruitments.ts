import { http, HttpResponse } from "msw";

/**
 * 求人関連のMSWハンドラー
 */
export const recruitmentsHandlers = [
	// TODO: GET /api/v1/recruitments - 求人一覧取得
	http.get("/api/v1/recruitments", () => {
		return HttpResponse.json({
			recruitments: [
				{
					id: "1",
					title: "フロントエンドエンジニア",
					salary: 5000000,
					status: "published",
				},
				{
					id: "2",
					title: "バックエンドエンジニア",
					salary: 6000000,
					status: "published",
				},
			],
		});
	}),

	// TODO: GET /api/v1/recruitments/:id - 求人詳細取得
	// TODO: POST /api/v1/recruitments - 求人作成
	// TODO: PUT /api/v1/recruitments/:id - 求人更新
	// TODO: DELETE /api/v1/recruitments/:id - 求人削除
];
