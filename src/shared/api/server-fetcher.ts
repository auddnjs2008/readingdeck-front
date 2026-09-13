import "server-only";

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { API_TIMEOUT_MS } from "@/shared/api/auth-retry";

type QueryValue = string | number | boolean | null | undefined;

type ServerFetcherOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown>;
  query?: Record<string, QueryValue>;
  authenticated?: boolean;
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
    signal: init.signal ?? AbortSignal.timeout(API_TIMEOUT_MS),
  });
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
  const { authenticated = true, ...requestOptions } = options;
  const cookieHeader = authenticated ? (await cookies()).toString() : "";
  const request = prepareRequest(path, requestOptions, cookieHeader);
  const response = await executeRequest(request);

  if (!authenticated && response.status === 404) notFound();

  if (authenticated && response.status === 401) {
    redirect("/auth/refresh");
  }

  if (authenticated && response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Server request failed: ${response.status} ${response.statusText}`);
  }

  return parseResponse<T>(response);
}
