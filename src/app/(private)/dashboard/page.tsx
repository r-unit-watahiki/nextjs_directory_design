export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">今日のシフト</h2>
          <p className="text-3xl font-bold text-blue-600">5人</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">未読メッセージ</h2>
          <p className="text-3xl font-bold text-green-600">3件</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">求人応募</h2>
          <p className="text-3xl font-bold text-orange-600">2件</p>
        </div>
      </div>
    </div>
  );
}
