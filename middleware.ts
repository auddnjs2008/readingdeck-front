import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/privacy",
  "/support",
  "/terms",
]);

const splitSetCookieHeader = (header: string) => {
  return header.split(/,(?=\s*[^;,=\s]+=[^;,]*)/g).map((value) => value.trim());
};

const extractCookiePair = (setCookie: string) => {
  return setCookie.split(";")[0]?.trim() ?? "";
};

const mergeCookieHeader = (cookieHeader: string, setCookieHeaders: string[]) => {
  const cookieMap = new Map<string, string>();

  cookieHeader
    .split(";")
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const separatorIndex = pair.indexOf("=");
      if (separatorIndex <= 0) return;
      cookieMap.set(pair.slice(0, separatorIndex), pair.slice(separatorIndex + 1));
    });

  setCookieHeaders
    .map(extractCookiePair)
    .filter(Boolean)
    .forEach((pair) => {
      const separatorIndex = pair.indexOf("=");
      if (separatorIndex <= 0) return;
      cookieMap.set(pair.slice(0, separatorIndex), pair.slice(separatorIndex + 1));
    });

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
};

const getSetCookieHeaders = (headers: Headers) => {
  const getSetCookie = headers.getSetCookie?.bind(headers);
  return getSetCookie?.() ?? splitSetCookieHeader(headers.get("set-cookie") ?? "");
};

const shouldSkipRefresh = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.includes(".")) return true;

  return false;
};

export async function middleware(request: NextRequest) {
  if (shouldSkipRefresh(request)) {
    return NextResponse.next();
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieHeader = request.headers.get("cookie") ?? "";

  if (!baseUrl || !cookieHeader) {
    return NextResponse.next();
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
    return NextResponse.next();
  }

  const setCookieHeaders = getSetCookieHeaders(refreshResponse.headers);

  if (setCookieHeaders.length === 0) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("cookie", mergeCookieHeader(cookieHeader, setCookieHeaders));

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  setCookieHeaders.forEach((setCookie) => {
    response.headers.append("set-cookie", setCookie);
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
