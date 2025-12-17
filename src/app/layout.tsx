import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'シフト管理アプリ',
  description: '店舗のシフト管理システム',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <h1 className="text-3xl font-bold">シフト管理システム</h1>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
