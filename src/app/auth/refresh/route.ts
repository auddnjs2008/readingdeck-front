import { NextRequest, NextResponse } from "next/server";

import { getSetCookieHeaders } from "@/shared/api/cookie-header";
import { API_TIMEOUT_MS } from "@/shared/api/auth-retry";

const getSafeNextPath = (request: NextRequest) => {
  const next = request.nextUrl.searchParams.get("next");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/books";
  }

  if (next.startsWith("/auth/refresh") || next.startsWith("/login")) {
    return "/books";
  }

  return next;
};

export async function GET(request: NextRequest) {
  const nextPath = getSafeNextPath(request);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieHeader = request.headers.get("cookie") ?? "";

  if (!baseUrl || !cookieHeader) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(nextPath)}`, request.url));
  }

  let refreshResponse: Response;

  try {
    refreshResponse = await fetch(new URL("/auth/refresh", baseUrl), {
      body: JSON.stringify({}),
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      method: "POST",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(nextPath)}`, request.url));
  }

  const setCookieHeaders = getSetCookieHeaders(refreshResponse.headers);
  const hasAccessToken = setCookieHeaders.some((value) =>
    value.trimStart().startsWith("access_token=")
  );

  const response = NextResponse.redirect(
    new URL(
      refreshResponse.ok && hasAccessToken
        ? nextPath
        : `/login?next=${encodeURIComponent(nextPath)}`,
      request.url
    )
  );

  setCookieHeaders.forEach((setCookie) => {
    response.headers.append("set-cookie", setCookie);
  });

  return response;
}
