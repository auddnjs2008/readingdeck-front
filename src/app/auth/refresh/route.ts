import { NextRequest, NextResponse } from "next/server";

import { getSetCookieHeaders } from "@/shared/api/cookie-header";

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

  const refreshResponse = await fetch(new URL("/auth/refresh", baseUrl), {
    body: JSON.stringify({}),
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader,
    },
    method: "POST",
  });

  if (!refreshResponse.ok) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(nextPath)}`, request.url));
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  const setCookieHeaders = getSetCookieHeaders(refreshResponse.headers);

  setCookieHeaders.forEach((setCookie) => {
    response.headers.append("set-cookie", setCookie);
  });

  return response;
}
