'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  userId: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ユーザー一覧を取得
        const usersResponse = await fetch('/api/v1/users');
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);

        // シフト一覧を取得
        const shiftsResponse = await fetch('/api/v1/shifts');
        const shiftsData = await shiftsResponse.json();
        setShifts(shiftsData.shifts || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ユーザー一覧 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">ユーザー一覧</h2>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="border-b pb-2">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* シフト一覧 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">今日のシフト</h2>
          <ul className="space-y-2">
            {shifts.map((shift) => (
              <li key={shift.id} className="border-b pb-2">
                <p className="font-medium">{shift.date}</p>
                <p className="text-sm text-gray-600">
                  {shift.startTime} - {shift.endTime}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
