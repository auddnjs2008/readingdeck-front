// AI-assisted test; user approved the product scope. HTTP mocks isolate all writes.
// Checks draft preservation, optional email, entry points and AI reaction compatibility.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const origin = "http://localhost:4420";
const state = {
  signedIn: false,
  bookCount: 0,
  fail: false,
  hold: null,
  requests: [],
  unknown: [],
};
const api = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }
  const path = new URL(req.url, origin).pathname;
  let status = 200,
    data;
  if (path === "/me") {
    status = state.signedIn ? 200 : 401;
    data = { id: 1, name: "독자", email: "reader@example.com", profile: null };
  } else if (path.includes("refresh")) {
    status = 401;
    data = {};
  } else if (path === "/feedback" && req.method === "POST") {
    let body = "";
    for await (const chunk of req) body += chunk;
    state.requests.push(JSON.parse(body));
    if (state.hold) await state.hold;
    status = state.fail ? 500 : 200;
    data = { ok: !state.fail };
  } else if (path === "/me/library-stats")
    data = { bookCount: state.bookCount, cardCount: 0 };
  else if (path === "/me/home-summary")
    data = {
      revisitCards: [],
      currentReadingBooks: [],
      recentRecordedBooks: [],
      deckSuggestions: [],
    };
  else if (path === "/decks")
    data = { items: [], meta: { total: 0, nextCursor: null } };
  else if (path === "/ai/chat/usage")
    data = { limit: 5, remaining: 4, resetsAt: "2026-09-22T00:00:00Z" };
  else if (path === "/ai/chat")
    data = {
      threadId: "test-thread",
      answer: "기록을 다시 읽어보세요.",
      sources: [],
    };
  else {
    state.unknown.push(`${req.method} ${path}`);
    status = 500;
    data = {};
  }
  res
    .writeHead(status, { "Content-Type": "application/json" })
    .end(JSON.stringify(data));
});
const originalConfig = await readFile("tsconfig.json", "utf8");
await new Promise((resolve) => api.listen(4421, "127.0.0.1", resolve));
const next = spawn(
  "node",
  ["node_modules/next/dist/bin/next", "dev", "-p", "4420"],
  {
    env: {
      ...process.env,
      NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1:4421",
      NEXT_DIST_DIR: ".next/feedback-check",
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
    state.signedIn = false;
    state.fail = false;
    state.hold = null;
    state.bookCount = 0;
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const close = page.getByRole("button", {
      name: "Close tanstack query devtools",
      exact: true,
    });
    await page.addLocatorHandler(close, () => close.click());
    const email = page.getByLabel("답변받을 이메일");
    const content = page.getByLabel("내용", { exact: true });
    const submit = page.getByRole("button", {
      name: "의견 보내기",
      exact: true,
    });
    await page.goto(`${origin}/feedback?from=/books`);
    await content.fill("책을 찾기가 어려워요.");
    await page.getByLabel("불편해요", { exact: true }).check();
    await page.screenshot({
      path: `/private/tmp/feedback-light-${width}.png`,
      fullPage: true,
    });
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.screenshot({
      path: `/private/tmp/feedback-dark-${width}.png`,
      fullPage: true,
    });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await submit.click();
    await page
      .getByRole("heading", { name: "의견을 보내주셔서 감사해요." })
      .waitFor();
    assert.deepEqual(state.requests.at(-1), {
      message: "책을 찾기가 어려워요.",
      category: "problem",
      pagePath: "/books",
    });
    assert.equal(new URL(page.url()).pathname, "/feedback");

    state.signedIn = true;
    state.fail = true;
    await page.goto(
      `${origin}/feedback?from=https://example.com/private?token=secret`,
    );
    await page.waitForFunction(
      () =>
        document.querySelector("#feedback-email")?.value === "",
    );
    await email.fill("");
    await content.fill("작성한 내용을 유지해주세요.");
    await submit.click();
    await page
      .getByRole("alert")
      .filter({ hasText: "전송하지 못했어요" })
      .waitFor();
    assert.equal(await content.inputValue(), "작성한 내용을 유지해주세요.");
    assert.equal(await email.inputValue(), "");
    assert.equal(state.requests.at(-1).pagePath, "/feedback");
    assert.equal(state.requests.at(-1).replyEmail, undefined);
    state.fail = false;
    let release;
    state.hold = new Promise((resolve) => {
      release = resolve;
    });
    const count = state.requests.length;
    const sent = page.waitForRequest(
      (request) =>
        request.method() === "POST" && request.url().endsWith("/feedback"),
    );
    await submit.click();
    await sent;
    assert.equal(
      await page.getByRole("button", { name: "보내는 중…" }).isDisabled(),
      true,
    );
    await page
      .locator("form")
      .evaluate((form) =>
        form.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        ),
      );
    release();
    state.hold = null;
    await page
      .getByRole("heading", { name: "의견을 보내주셔서 감사해요." })
      .waitFor();
    assert.equal(
      state.requests.length,
      count + 1,
      "전송 중 중복 제출은 요청을 추가하지 않는다",
    );

    await page.goto(`${origin}/feedback`);
    await page.waitForFunction(
      () =>
        document.querySelector("#feedback-email")?.value === "",
    );
    await email.fill("reply@example.com");
    await content.fill("새 기능을 제안해요.");
    await page.getByLabel("제안해요", { exact: true }).check();
    await submit.click();
    await page
      .getByText("답변이 필요하면 남겨주신 이메일로 연락드릴게요.", {
        exact: true,
      })
      .waitFor();
    assert.equal(state.requests.at(-1).replyEmail, "reply@example.com");

    for (const bookCount of [0, 1]) {
      state.bookCount = bookCount;
      await page.goto(`${origin}/books`);
      await page
        .getByRole("link", { name: "의견 보내기", exact: true })
        .click();
      await page.waitForURL(`${origin}/feedback?from=/books`);
    }
    await page.goto(`${origin}/profile`);
    await page.getByRole("link", { name: "의견 보내기", exact: true }).click();
    await page.waitForURL(`${origin}/feedback?from=/profile`);
    await page.goto(origin);
    await page.getByRole("link", { name: "의견 보내기", exact: true }).click();
    await page.waitForURL(`${origin}/feedback?from=/`);
    // Development tooling overlaps the product launcher on desktop; exclude only that overlay.
    await page.addStyleTag({
      content: ".tsqd-parent-container { display: none !important; }",
    });
    await page
      .getByRole("button", { name: "AI 독서 대화", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "ReadingDeck 대화" });
    assert.equal(
      await dialog.getByRole("button", { name: "피드백", exact: true }).count(),
      0,
    );
    await dialog.getByLabel("AI 질문").fill("내 생각을 알려줘");
    await dialog.getByRole("button", { name: "전송", exact: true }).click();
    await dialog
      .getByText("기록을 다시 읽어보세요.", { exact: true })
      .waitFor();
    const reaction = page.waitForResponse(
      (response) =>
        response.url().endsWith("/feedback") &&
        response.request().method() === "POST",
    );
    await dialog.getByRole("button", { name: "좋아요", exact: true }).click();
    await reaction;
    assert.match(state.requests.at(-1).message, /^\[AI_REACTION\] up/);
    await page.keyboard.press("Escape");
    await context.close();
  }
  assert.deepEqual(state.unknown, []);
  console.log(
    "PASS: 비회원 접수, 이메일 수정·삭제, 실패 후 입력 유지·재전송, 중복 방지, 홈·프로필·랜딩 입구, AI 평가, 390/1280px",
  );
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
