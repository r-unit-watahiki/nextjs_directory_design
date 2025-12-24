import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// POST /api/messages - NestJS APIにメッセージを投稿してキャッシュを再検証
export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('📝 メッセージ投稿を受信:', body);

    // NestJS APIにそのまま転送
    const response = await fetch('http://localhost:3001/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API呼び出しに失敗: ${response.statusText}`);
    }

    const newMessage = await response.json();
    console.log('✅ メッセージを作成しました:', newMessage);

    // 🔥 ここが重要！ 'messages' タグのキャッシュを無効化
    console.log('🔄 revalidateTag("messages") を実行...');
    revalidateTag('messages', {});
    console.log('✨ キャッシュ無効化完了！');

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('❌ エラー:', error);
    return NextResponse.json({ error: 'メッセージの投稿に失敗しました' }, { status: 500 });
  }
}
