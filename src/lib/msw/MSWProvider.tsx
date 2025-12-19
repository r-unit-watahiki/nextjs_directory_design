'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface MSWProviderProps {
  children: ReactNode;
}

/**
 * MSWを条件付きで初期化するプロバイダー
 * NEXT_PUBLIC_API_MOCKING=enabled の場合にMSWを起動
 */
export function MSWProvider({ children }: MSWProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initMSW = async () => {
      // 環境変数でモックが有効かチェック
      if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
        // 動的インポートでMSWを読み込み
        const { worker } = await import('./browser');

        // Service Workerを起動
        await worker.start({
          onUnhandledRequest: 'bypass', // 未定義のリクエストはそのまま通す
        });

        console.log('[MSW] Mocking enabled');
      }

      setIsReady(true);
    };

    initMSW();
  }, []);

  // MSW起動完了まで子要素をレンダリングしない
  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
