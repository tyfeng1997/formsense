// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // This is needed to update the user's session
  const response = await updateSession(request);

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
