import { http, HttpResponse } from "msw";

/**
 * シフト関連のMSWハンドラー
 */
export const shiftsHandlers = [
	// TODO: GET /api/v1/shifts - シフト一覧取得
	http.get("/api/v1/shifts", () => {
		return HttpResponse.json({
			shifts: [
				{
					id: "1",
					date: "2025-12-20",
					startTime: "09:00",
					endTime: "18:00",
					userId: "1",
				},
				{
					id: "2",
					date: "2025-12-21",
					startTime: "10:00",
					endTime: "19:00",
					userId: "2",
				},
			],
		});
	}),

	// TODO: GET /api/v1/shifts/:id - シフト詳細取得
	// TODO: POST /api/v1/shifts - シフト作成
	// TODO: PUT /api/v1/shifts/:id - シフト更新
	// TODO: DELETE /api/v1/shifts/:id - シフト削除
	// TODO: GET /api/v1/shifts/daily - 日次シフト取得
	// TODO: GET /api/v1/shifts/weekly - 週次シフト取得
];
