import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, mocks) {
  const exports = {};
  const { outputText } = ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  runInNewContext(outputText, { exports, require: (name) => mocks[name] ?? require(name), Date });
  return exports;
}

test("사용량은 서버에서 조회하고 사용자별 캐시로 분리한다", async () => {
  let requestedPath;
  const usage = { limit: 10, remaining: 3, resetsAt: "2026-09-20T00:00:00Z" };
  const api = load("../api/chat.ts", {
    "@/shared/api/fetcher": { get: async (path) => { requestedPath = path; return { data: usage }; } },
  });
  assert.equal(await api.getChatUsage(), usage);
  assert.equal(requestedPath, "/ai/chat/usage");
  const { useAiChatUsageQuery } = load("./useAiChatUsageQuery.ts", {
    "@tanstack/react-query": { useQuery: (options) => options },
    "@/features/ai/chat/api/chat": api,
  });
  const open = useAiChatUsageQuery(7, true);
  assert.equal(open.enabled, true);
  assert.equal(open.queryFn, api.getChatUsage);
  assert.notDeepEqual(open.queryKey, useAiChatUsageQuery(8, true).queryKey);
  assert.equal(useAiChatUsageQuery(7, false).enabled, false);
  assert.equal(useAiChatUsageQuery(undefined, true).enabled, false);
  assert.equal(open.staleTime, 0);
  assert.equal(open.retry, false);
  assert.equal(open.refetchInterval({ state: { data: { ...usage, resetsAt: new Date(Date.now() - 1).toISOString() } } }), 1000);
  assert.equal(open.refetchInterval({ state: { status: "error", data: { ...usage, resetsAt: new Date(Date.now() - 1).toISOString() } } }), 60_000);
});
