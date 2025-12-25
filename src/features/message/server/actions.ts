'use server';

import { revalidateTag } from 'next/cache';

type CreateMessageInput = {
  content: string;
  senderId: string;
  receiverId: string;
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * メッセージを作成するサーバーアクション
 * NestJS APIにメッセージを投稿してキャッシュを再検証します
 */
export async function createMessage(input: CreateMessageInput): Promise<Message> {
  console.log('メッセージ投稿を受信:', input);

  try {
    // NestJS APIにそのまま転送
    const response = await fetch('http://localhost:3001/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`API呼び出しに失敗: ${response.statusText}`);
    }

    const newMessage = await response.json();
    console.log('メッセージを作成しました:', newMessage);

    // ここが重要！ 'messages' タグのキャッシュを無効化
    console.log('revalidateTag("messages") を実行...');
    revalidateTag('messages', {});
    console.log('キャッシュ無効化完了');

    return newMessage;
  } catch (error) {
    console.error('エラー:', error);
    throw new Error('メッセージの投稿に失敗しました');
  }
}
