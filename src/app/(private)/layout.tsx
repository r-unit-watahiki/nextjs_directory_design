import Link from "next/link";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: 実際の認証チェックを実装する
  // const session = await getSession();
  // if (!session) redirect('/login');

  return (
    <div className="flex">
      {/* サイドバー */}
      <aside className="w-64 bg-white shadow-md min-h-screen">
        <nav className="p-4">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800">メニュー</h2>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                ダッシュボード
              </Link>
            </li>
            <li>
              <Link
                href="/shifts/daily"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                日別シフト
              </Link>
            </li>
            <li>
              <Link
                href="/shifts/weekly"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                曜日別シフト
              </Link>
            </li>
            <li>
              <Link
                href="/recruitment"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                求人管理
              </Link>
            </li>
            <li>
              <Link
                href="/messages"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                メッセージ
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <div className="flex-1">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
