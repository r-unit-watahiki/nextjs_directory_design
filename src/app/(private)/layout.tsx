'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: 実際の認証チェックを実装する
  // const session = await getSession();
  // if (!session) redirect('/login');

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        // 最上部にいる場合は常に表示
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // 下にスクロール → ヘッダーを隠す
        setIsVisible(false);
      } else {
        // 上にスクロール → ヘッダーを表示
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const navigationItems = [
    { label: '曜日別WSシフト', href: '/shifts/weekly' },
    { label: '日別勤務計画', href: '/shifts/daily' },
    { label: '求人管理', href: '/recruitment' },
    { label: 'メッセージ', href: '/messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ロゴ */}
            <div className="flex-shrink-0">
              <Link
                href="/dashboard"
                className="flex items-center"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900 hidden sm:inline">
                  シフト管理
                </span>
              </Link>
            </div>

            {/* ナビゲーションメニュー */}
            <nav className="flex items-center space-x-1">
              {navigationItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ - ヘッダーの高さ分の余白を追加 */}
      <main className="pt-16">{children}</main>
    </div>
  );
}
