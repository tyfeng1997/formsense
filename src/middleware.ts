// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { usageLimiter } from "@/middleware/usage-limiter"; // 导入 usageLimiter 函数
export async function middleware(request: NextRequest) {
  // This is needed to update the user's session
  const response = await updateSession(request);
  // 检查是否是需要限制的 API 路径
  if (request.nextUrl.pathname.startsWith("/api/extract")) {
    // 对 /api/extract API 应用使用量限制
    return usageLimiter(request, async (req) => {
      // 当用户通过使用量限制检查后，继续处理请求
      // 返回原始响应，因为我们只需要验证用户是否超出限制
      return response;
    });
  }
  // We don't want to redirect from the dashboard page anymore since we'll show the login modal
  // instead, but we still want to update the session
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/dashboard/:path*",
    "/api/extract/:path*",
    "/api/templates/:path*",
    "/api/subscriptions/:path*",
    "/auth/:path*",
    "/login/:path*",
  ],
};
