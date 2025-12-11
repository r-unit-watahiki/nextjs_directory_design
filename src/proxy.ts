import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16のproxy.ts
// 認証が必要なルートと不要なルートの制御

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 公開ルート（認証不要）
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // TODO: 実際の認証チェックを実装する
  // const token = request.cookies.get('session')?.value;
  // const isAuthenticated = await verifyToken(token);

  // 認証が必要なルートで未認証の場合、ログインページにリダイレクト
  if (!isPublicPath) {
    // TODO: 認証チェック実装後に有効化
    // if (!isAuthenticated) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  // 認証済みユーザーがログイン/登録ページにアクセスした場合、ダッシュボードにリダイレクト
  if (isPublicPath) {
    // TODO: 認証チェック実装後に有効化
    // if (isAuthenticated) {
    //   return NextResponse.redirect(new URL('/dashboard', request.url));
    // }
  }

  return NextResponse.next();
}

// マッチャー設定: すべてのルートで実行（静的ファイルを除く）
export const config = {
  matcher: [
    /*
     * 以下を除くすべてのルートにマッチ:
     * - api (APIルート)
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化ファイル)
     * - favicon.ico (faviconファイル)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
