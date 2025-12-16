export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">メッセージ</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* メッセージリスト */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">メッセージ一覧</h2>
          </div>
          <div className="divide-y">
            {[
              {
                id: "1",
                name: "山田 太郎",
                message: "明日のシフトについて",
                time: "10:30",
                unread: true,
              },
              {
                id: "2",
                name: "佐藤 花子",
                message: "お疲れ様です",
                time: "昨日",
                unread: false,
              },
              {
                id: "3",
                name: "鈴木 一郎",
                message: "了解しました",
                time: "2日前",
                unread: false,
              },
            ].map((msg) => (
              <div
                key={msg.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  msg.unread ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-semibold">{msg.name}</p>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* メッセージ詳細 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">山田 太郎</h2>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[70%]">
                <p className="text-sm">
                  明日のシフトについて確認したいことがあります
                </p>
                <span className="text-xs text-gray-500">10:30</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[70%]">
                <p className="text-sm">はい、どうぞ</p>
                <span className="text-xs text-blue-100">10:32</span>
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="メッセージを入力..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                送信
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
