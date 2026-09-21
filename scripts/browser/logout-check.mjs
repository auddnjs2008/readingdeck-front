// Isolated HTTP mock: never logs out a real user or modifies their data.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = "http://localhost:4430";
const state = { signedIn: true, fail: true, logouts: 0, unknown: [] };
const api = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204).end(); return; }
  const path = new URL(req.url, origin).pathname;
  let status = 200, data;
  if (path === "/me") { status = state.signedIn ? 200 : 401; data = { id: 1, name: "로그아웃 테스트 독자", email: "reader@example.com" }; }
  else if (path.includes("refresh")) { status = 401; data = {}; }
  else if (path === "/auth/logout" && req.method === "POST") {
    state.logouts++;
    status = state.fail ? 500 : 200;
    if (!state.fail) state.signedIn = false;
    data = { ok: !state.fail };
  } else if (path === "/me/library-stats") data = { bookCount: 1, cardCount: 2 };
  else { state.unknown.push(`${req.method} ${path}`); status = 500; data = {}; }
  res.writeHead(status, { "Content-Type": "application/json" }).end(JSON.stringify(data));
});
const originalConfig = await readFile("tsconfig.json", "utf8");
await new Promise((resolve) => api.listen(4431, "127.0.0.1", resolve));
const next = spawn(
  "node",
  ["node_modules/next/dist/bin/next", "dev", "-p", "4430"],
  {
    env: {
      ...process.env,
      NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1:4431",
      NEXT_DIST_DIR: ".next/logout-check",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let logs = "";
next.stdout.on("data", (chunk) => (logs += chunk));
next.stderr.on("data", (chunk) => (logs += chunk));
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      clearInterval(timer);
      reject(new Error(logs));
    }, 60000);
    const timer = setInterval(() => {
      if (/Ready in/.test(logs)) {
        clearInterval(timer);
        clearTimeout(timeout);
        resolve();
      }
    }, 100);
  });
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  for (const width of [390, 1280]) {
    state.signedIn = true; state.fail = true;
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const close = page.getByRole("button", { name: "Close tanstack query devtools", exact: true });
    await page.addLocatorHandler(close, () => close.click());
    await page.goto(`${origin}/profile`);
    await page.getByRole("heading", { name: "로그아웃 테스트 독자" }).waitFor();
    await page.evaluate(() => sessionStorage.setItem("reflection-last-deck", "7"));
    const button = page.getByRole("button", { name: "로그아웃", exact: true });
    await button.click();
    await page.getByText("로그아웃하지 못했어요. 다시 시도해 주세요.", { exact: true }).waitFor();
    assert.equal(new URL(page.url()).pathname, "/profile");
    assert.equal(await page.evaluate(() => sessionStorage.getItem("reflection-last-deck")), "7");
    state.fail = false;
    await button.click();
    await page.waitForURL(`${origin}/`);
    await page.getByRole("button", { name: "시작하기", exact: true }).or(page.getByRole("link", { name: "시작하기", exact: true })).first().waitFor();
    assert.equal(await page.evaluate(() => sessionStorage.getItem("reflection-last-deck")), null);
    await page.goto(`${origin}/profile`);
    await page.waitForURL(`${origin}/login`);
    assert.equal(await page.getByRole("heading", { name: "로그아웃 테스트 독자" }).count(), 0);
    await context.close();
  }
  assert.equal(state.logouts, 4);
  assert.deepEqual(state.unknown, []);
  console.log("PASS: 로그아웃 실패 후 재시도·랜딩 이동·개인 상태 정리·보호 페이지 재진입 차단 (390/1280px)");
} catch (error) {
  console.error(error, logs.slice(-4000));
  throw error;
} finally {
  next.kill("SIGTERM");
  api.closeAllConnections();
  await new Promise((resolve) => api.close(resolve));
  if (browser)
    await Promise.race([
      browser.close(),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  await writeFile("tsconfig.json", originalConfig);
}
