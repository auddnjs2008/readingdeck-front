import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import axios from "axios";
import { QueryClient, InfiniteQueryObserver, dehydrate, hydrate } from "@tanstack/react-query";
import { API_TIMEOUT_MS, claimAuthRetry } from "./auth-retry.ts";

const require = createRequire(import.meta.url);
function load(file, mocks, globals = {}) {
  const exports = {};
  const { outputText } = ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  runInNewContext(outputText, {
    exports, require: (name) => name in mocks ? mocks[name] : require(name),
    Headers, AbortSignal, URL, FormData,
    process: { env: { NEXT_PUBLIC_API_BASE_URL: "https://api.example.test" } },
    ...globals,
  });
  return exports;
}

test("failed optional authentication keeps community open but protects private routes", async () => {
  for (const pathname of ["/community", "/community/12", "/book-info/9780306406157", "/books", "/community-private"]) {
    for (const status of [401, 403]) {
      const location = { pathname, href: pathname };
      const { default: fetcher } = load("./fetcher.ts", {
        "@/shared/api/auth/refresh": { refresh: async () => { throw new axios.AxiosError("No session", "ERR_BAD_REQUEST", undefined, null, { status: 401 }); } },
        "@/shared/api/auth-retry": { API_TIMEOUT_MS, claimAuthRetry },
      }, { window: { location } });
      fetcher.defaults.adapter = async (config) => {
        throw new axios.AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, { status, config });
      };
      await assert.rejects(fetcher.get("/me"));
      assert.equal(location.href, status === 403 || pathname === "/community" || pathname === "/community/12" || pathname.startsWith("/book-info/") ? pathname : "/login");
    }
  }
});

test("refresh network errors and server failures do not send users to login", async () => {
  for (const status of [undefined, 500]) {
    const location = { pathname: "/books", href: "/books" };
    const { default: fetcher } = load("./fetcher.ts", {
      "@/shared/api/auth/refresh": { refresh: async () => {
        throw new axios.AxiosError("Refresh unavailable", "ECONNABORTED", undefined, null, status ? { status } : undefined);
      } },
      "@/shared/api/auth-retry": { API_TIMEOUT_MS, claimAuthRetry },
    }, { window: { location } });
    fetcher.defaults.adapter = async config => {
      throw new axios.AxiosError("Expired", "ERR_BAD_REQUEST", config, null, { status: 401, config });
    };
    await assert.rejects(fetcher.get("/me"));
    assert.equal(location.href, "/books");
  }
});

test("concurrent expired requests refresh once and replay at most once", async () => {
  for (const refreshFails of [false, true]) {
    let finishRefresh;
    let refreshCalls = 0;
    const location = { pathname: "/books", href: "/books" };
    const { default: fetcher } = load("./fetcher.ts", {
      "@/shared/api/auth/refresh": { refresh: () => {
        refreshCalls++;
        return new Promise((resolve, reject) => { finishRefresh = () => refreshFails
          ? reject(new axios.AxiosError("No session", "ERR_BAD_REQUEST", undefined, null, { status: 401 }))
          : resolve(); });
      } },
      "@/shared/api/auth-retry": { API_TIMEOUT_MS, claimAuthRetry },
    }, { window: { location } });
    const calls = new Map();
    fetcher.defaults.adapter = async config => {
      calls.set(config.url, (calls.get(config.url) ?? 0) + 1);
      throw new axios.AxiosError("Expired", "ERR_BAD_REQUEST", config, null, { status: 401, config });
    };
    const requests = Promise.allSettled([fetcher.get("/me"), fetcher.get("/books")]);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(refreshCalls, 1);
    finishRefresh();
    assert.ok((await requests).every(result => result.status === "rejected"));
    assert.equal(refreshCalls, 1);
    assert.deepEqual([...calls.values()], refreshFails ? [1, 1] : [2, 2]);
    assert.equal(location.href, "/login");
  }
});

test("public server reads omit cookies and never refresh on 401 or 403", async () => {
  for (const status of [200, 401, 403]) {
    let cookieReads = 0;
    let cookieHeader;
    const { serverFetcher } = load("./server-fetcher.ts", {
      "server-only": {},
      "next/headers": { cookies: async () => { cookieReads++; return { toString: () => "access_token=private" }; } },
      "next/navigation": { redirect: () => assert.fail("Public request must not redirect") },
      "@/shared/api/auth-retry": { API_TIMEOUT_MS },
    }, { fetch: async (_url, options) => {
      cookieHeader = options.headers.get("cookie");
      return new Response(JSON.stringify({ id: 12 }), { status });
    } });
    const result = serverFetcher("/community/posts/12");
    if (status === 200) assert.deepEqual(await result, { id: 12 });
    else await assert.rejects(result, /Server request failed/);
    assert.equal(cookieReads, 0);
    assert.equal(cookieHeader, null);
  }
});

test("hydrated feed reuses the first page and fetches only the next cursor", async () => {
  const { RQcommunityQueryKey } = load("../../entities/community/model/queries/RQcommunityQueryKey.ts", {});
  const { communityPostsOptions, COMMUNITY_FEED_REQUEST } = load("../../entities/community/model/queries/community-posts-options.ts", {
    "@/entities/community/api/getCommunityPosts": {},
    "./RQcommunityQueryKey": { RQcommunityQueryKey },
  });
  const serverClient = new QueryClient();
  const browserClient = new QueryClient();
  const serverCalls = [];
  const browserCalls = [];
  const fetchPage = (calls) => async (req) => {
    const cursor = req.query.cursor;
    calls.push(cursor);
    return { items: [{ id: cursor + 1 }], meta: { nextCursor: cursor === 0 ? 18 : null } };
  };
  let unsubscribe;
  try {
    await serverClient.fetchInfiniteQuery(communityPostsOptions(COMMUNITY_FEED_REQUEST, fetchPage(serverCalls)));
    hydrate(browserClient, dehydrate(serverClient));
    const observer = new InfiniteQueryObserver(browserClient, communityPostsOptions(COMMUNITY_FEED_REQUEST, fetchPage(browserCalls)));
    unsubscribe = observer.subscribe(() => {});
    assert.deepEqual(serverCalls, [0]);
    assert.deepEqual(browserCalls, []);
    assert.equal(observer.getCurrentResult().data.pages[0].items[0].id, 1);
    await observer.fetchNextPage();
    assert.deepEqual(browserCalls, [18]);
    assert.equal(observer.getCurrentResult().data.pages.length, 2);
    assert.equal(observer.getCurrentResult().hasNextPage, false);
  } finally {
    unsubscribe?.();
    serverClient.clear();
    browserClient.clear();
  }
});

test("QueryClient is isolated on the server and reused in the browser", () => {
  const server = load("../../app/providers/get-query-client.ts", {});
  assert.notEqual(server.getQueryClient(), server.getQueryClient());
  const browser = load("../../app/providers/get-query-client.ts", {}, { window: {} });
  assert.equal(browser.getQueryClient(), browser.getQueryClient());
});

test("missing public posts trigger notFound instead of authentication redirects", async () => {
  const { serverFetcher } = load("./server-fetcher.ts", {
    "server-only": {},
    "next/headers": { cookies: () => assert.fail("Public request must not read cookies") },
    "next/navigation": { notFound: () => { throw new Error("NOT_FOUND"); } },
    "@/shared/api/auth-retry": { API_TIMEOUT_MS },
  }, { fetch: async () => new Response(null, { status: 404 }) });
  await assert.rejects(serverFetcher("/community/posts/999"), /NOT_FOUND/);
});
