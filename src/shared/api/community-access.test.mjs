import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import axios from "axios";
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
  for (const pathname of ["/community", "/community/12", "/books", "/community-private"]) {
    for (const status of [401, 403]) {
      const location = { pathname, href: pathname };
      const { default: fetcher } = load("./fetcher.ts", {
        "@/shared/api/auth/refresh": { refresh: async () => { throw new Error("No session"); } },
        "@/shared/api/auth-retry": { API_TIMEOUT_MS, claimAuthRetry },
      }, { window: { location } });
      fetcher.defaults.adapter = async (config) => {
        throw new axios.AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, { status, config });
      };
      await assert.rejects(fetcher.get("/me"));
      assert.equal(location.href, pathname === "/community" || pathname === "/community/12" ? pathname : "/login");
    }
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
    const result = serverFetcher("/community/posts/12", { authenticated: false });
    if (status === 200) assert.deepEqual(await result, { id: 12 });
    else await assert.rejects(result, /Server request failed/);
    assert.equal(cookieReads, 0);
    assert.equal(cookieHeader, null);
  }
});

test("private server reads still forward cookies and refresh on 401", async () => {
  const { serverFetcher } = load("./server-fetcher.ts", {
    "server-only": {},
    "next/headers": { cookies: async () => ({ toString: () => "access_token=private" }) },
    "next/navigation": { redirect: (path) => { throw new Error(`Redirect ${path}`); } },
    "@/shared/api/auth-retry": { API_TIMEOUT_MS },
  }, { fetch: async (_url, options) => {
    assert.equal(options.headers.get("cookie"), "access_token=private");
    return new Response(null, { status: 401 });
  } });
  await assert.rejects(serverFetcher("/me"), /Redirect \/auth\/refresh/);
});
