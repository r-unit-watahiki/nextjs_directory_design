'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Message } from '@/app/(private)/messages/_types';

type Props = {
  initialMessages: Message[];
};

export function MessageList({ initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Next.js API Route に POST（revalidateTag が実行される）
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          senderId: '02eff36d-68ea-419e-a579-33b4f1fddb4d',
          receiverId: 'a6f6e0f6-4756-4f6a-9fb1-071c0bca0445',
        }),
      });

      if (!response.ok) {
        throw new Error('投稿に失敗しました');
      }

      const newMsg = await response.json();

      // ローカル状態を即座に更新（楽観的更新）
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');

      // ページをリフレッシュしてキャッシュから最新データを取得
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 投稿フォーム */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">新規メッセージ</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              メッセージ
            </label>
            <textarea
              id="message"
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="メッセージを入力してください..."
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting || !newMessage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '送信中...' : '送信'}
            </button>
            {isSubmitting && (
              <span className="text-sm text-gray-600 flex items-center">
                ※ 投稿後、revalidateTag('messages') が実行されます
              </span>
            )}
          </div>
        </form>
      </div>

      {/* メッセージ一覧 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold">メッセージ一覧 ({messages.length}件)</h2>
          <p className="text-xs text-gray-500 mt-1">
            ※ このデータは tags: ['messages'] でキャッシュされています
          </p>
        </div>
        <div className="divide-y">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">メッセージがありません</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      送信者: {msg.senderId.substring(0, 8)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      受信者: {msg.receiverId.substring(0, 8)}...
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleString('ja-JP')}
                  </span>
                </div>
                <p className="text-gray-700">{msg.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* テスト手順の説明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">キャッシュ再検証のテスト手順</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>
            <strong>ブラウザA</strong>: この画面でメッセージを投稿
            <div className="ml-6 mt-1 text-xs">
              → /api/messages で revalidateTag('messages') が実行される
            </div>
          </li>
          <li>
            <strong>ブラウザB</strong>: 別のブラウザ or シークレットモードでこの画面を開く
            <div className="ml-6 mt-1 text-xs">
              → キャッシュが無効化されているため、最新データを取得
            </div>
          </li>
          <li>
            <strong>確認</strong>: ブラウザBに投稿したメッセージが表示されることを確認
            <div className="ml-6 mt-1 text-xs">→ revalidateTag が動作している証拠！</div>
          </li>
        </ol>
      </div>
    </div>
  );
}
