import "server-only";

import { cookies } from "next/headers";

type QueryValue = string | number | boolean | null | undefined;

type ServerFetcherOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown>;
  query?: Record<string, QueryValue>;
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

export async function serverFetcher<T>(
  path: string,
  options: ServerFetcherOptions = {}
): Promise<T> {
  const { query, headers, body, ...init } = options;
  const cookieStore = await cookies();
  const requestHeaders = new Headers(headers);
  const cookieHeader = cookieStore.toString();

  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  }

  if (body && !(body instanceof FormData) && !requestHeaders.has("content-type")) {
    requestHeaders.set("content-type", "application/json");
  }

  const response = await fetch(buildUrl(path, query), {
    ...init,
    body:
      body && !(body instanceof FormData) && typeof body !== "string"
        ? JSON.stringify(body)
        : body,
    cache: init.cache ?? "no-store",
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error(`Server request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
