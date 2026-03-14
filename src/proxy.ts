import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/login", "/terms", "/privacy"]);
const APP_HOME_PATH = "/books";

const hasAuthCookie = (request: NextRequest) =>
  Boolean(
    request.cookies.get("access_token") || request.cookies.get("refresh_token")
  );

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.has(pathname);
  const isAuthenticated = hasAuthCookie(request);

  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL(APP_HOME_PATH, request.url));
  }

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
