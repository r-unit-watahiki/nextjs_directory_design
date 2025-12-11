export default function WeeklyShiftPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">曜日別シフト</h1>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">スタッフ</th>
              <th className="text-center p-3">月</th>
              <th className="text-center p-3">火</th>
              <th className="text-center p-3">水</th>
              <th className="text-center p-3">木</th>
              <th className="text-center p-3">金</th>
              <th className="text-center p-3">土</th>
              <th className="text-center p-3">日</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "山田 太郎",
                shifts: ["○", "○", "○", "○", "○", "×", "×"],
              },
              {
                name: "佐藤 花子",
                shifts: ["×", "○", "○", "○", "○", "○", "×"],
              },
              {
                name: "鈴木 一郎",
                shifts: ["○", "×", "×", "○", "○", "○", "○"],
              },
            ].map((staff, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{staff.name}</td>
                {staff.shifts.map((shift, j) => (
                  <td key={j} className="text-center p-3">
                    <span
                      className={
                        shift === "○" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {shift}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
