export default function DailyShiftPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">日別シフト</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <input
            type="date"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-4">
          {[
            { id: '1', name: '山田 太郎', time: '09:00 - 18:00', role: '店長' },
            {
              id: '2',
              name: '佐藤 花子',
              time: '10:00 - 19:00',
              role: 'スタッフ',
            },
            {
              id: '3',
              name: '鈴木 一郎',
              time: '13:00 - 22:00',
              role: 'スタッフ',
            },
          ].map((shift) => (
            <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">{shift.name}</p>
                <p className="text-sm text-gray-600">{shift.role}</p>
              </div>
              <p className="text-gray-700">{shift.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
