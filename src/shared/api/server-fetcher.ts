import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type QueryValue = string | number | boolean | null | undefined;

type ServerFetcherOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown>;
  query?: Record<string, QueryValue>;
};

type PreparedRequest = {
  body?: BodyInit;
  headers: Headers;
  init: Omit<RequestInit, "body" | "headers">;
  url: URL;
};

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const url = new URL(path, baseUrl);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  return url;
};

const prepareRequest = (
  path: string,
  options: ServerFetcherOptions,
  cookieHeader: string
): PreparedRequest => {
  const { query, headers, body, ...init } = options;
  const requestHeaders = new Headers(headers);

  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  }

  if (body && !(body instanceof FormData) && !requestHeaders.has("content-type")) {
    requestHeaders.set("content-type", "application/json");
  }

  return {
    body:
      body && !(body instanceof FormData) && typeof body !== "string"
        ? JSON.stringify(body)
        : body,
    headers: requestHeaders,
    init,
    url: buildUrl(path, query),
  };
};

const executeRequest = ({ body, headers, init, url }: PreparedRequest) => {
  return fetch(url, {
    ...init,
    body,
    cache: init.cache ?? "no-store",
    headers,
  });
};

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

const refreshServerSession = async (cookieHeader: string) => {
  if (!cookieHeader) return null;

  const response = await fetch(buildUrl("/auth/refresh"), {
    body: JSON.stringify({}),
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader,
    },
    method: "POST",
  });

  if (!response.ok) return null;

  const getSetCookie = response.headers.getSetCookie?.bind(response.headers);
  const setCookieHeaders =
    getSetCookie?.() ??
    splitSetCookieHeader(response.headers.get("set-cookie") ?? "");

  if (setCookieHeaders.length === 0) {
    return cookieHeader;
  }

  return mergeCookieHeader(cookieHeader, setCookieHeaders);
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export async function serverFetcher<T>(
  path: string,
  options: ServerFetcherOptions = {}
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const request = prepareRequest(path, options, cookieHeader);
  const response = await executeRequest(request);

  if (response.status === 401) {
    const refreshedCookieHeader = await refreshServerSession(cookieHeader);

    if (refreshedCookieHeader) {
      const retryResponse = await executeRequest(
        prepareRequest(path, options, refreshedCookieHeader)
      );

      if (retryResponse.ok) {
        return parseResponse<T>(retryResponse);
      }

      if (retryResponse.status === 401 || retryResponse.status === 403) {
        redirect("/login");
      }

      throw new Error(
        `Server request failed: ${retryResponse.status} ${retryResponse.statusText}`
      );
    }

    redirect("/login");
  }

  if (response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Server request failed: ${response.status} ${response.statusText}`);
  }

  return parseResponse<T>(response);
}
