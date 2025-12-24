import type { Message } from '@/app/(private)/messages/_types';
import { MessageList } from './_components/MessageList';

// Server Component - データフェッチにタグを設定
export default async function MessagesPage() {
  let messages: Message[] = [];
  let error = null;

  try {
    // タグ付きでデータフェッチ - キャッシュされる
    const response = await fetch('http://localhost:3001/messages', {
      next: { tags: ['messages'] }, // ← キャッシュタグを設定
      cache: 'force-cache', // キャッシュを使用（デフォルト）
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `API Error (${response.status}): ${response.statusText}\n${text.substring(0, 200)}`,
      );
    }

    // Content-Type をチェック
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(
        `Expected JSON but got ${contentType || 'unknown content type'}. ` +
          `Response: ${text.substring(0, 200)}...`,
      );
    }

    messages = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to fetch messages:', err);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">メッセージ</h1>
        <p className="text-sm text-gray-600 mt-2">キャッシュ再検証のテスト画面</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold mb-2">API接続エラー</p>
          <div className="bg-white text-red-900 p-3 rounded mb-3 text-sm font-mono whitespace-pre-wrap">
            {error}
          </div>
          <div className="text-sm space-y-1">
            <p className="font-semibold">確認事項:</p>
            <ul className="list-disc list-inside ml-2">
              <li>NestJS APIサーバーが起動しているか</li>
              <li>ポート番号が 3001 で正しいか</li>
              <li>
                <code className="bg-red-100 px-1 rounded">curl http://localhost:3001/messages</code>{' '}
                でアクセスできるか確認
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <MessageList initialMessages={messages} />
      )}
    </div>
  );
}
