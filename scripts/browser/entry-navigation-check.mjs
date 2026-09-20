// Uses an existing Playwright installation; all API requests are mocked.
import assert from "node:assert/strict";
import { check as checkNavigation } from "./mobile-nav-check.mjs";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const origin = process.env.CHECK_ORIGIN || "http://localhost:4000";
const book = { id: 1, title: "습관에 관한 책", author: "첫 작가", status: "reading", backgroundImage: null, cardCount: 3, currentPage: 42, totalPages: 240 };
const card = { id: 1, type: "insight", thought: "작은 환경의 변화가 행동을 바꾼다.", quote: "매일 조금씩 읽는 일", book, createdAt: "2026-09-20", reasonLabel: "다시 읽어볼 생각" };

async function closeDevtools(page) {
  const close = page.getByRole("button", { name: "Close tanstack query devtools", exact: true });
  if (await close.isVisible()) await close.click();
}

async function fixture({ signedIn = true, width = 1280, cold = false, drafts = "success" } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const state = { drafts, unknown: [] };
  await context.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (request.resourceType() !== "xhr") return url.origin === origin ? route.continue() : route.abort();
    let status = 200;
    let data;
    if (url.pathname === "/me") { status = signedIn ? 200 : 401; data = signedIn ? { id: 1, name: "독자", profile: null } : {}; }
    else if (url.pathname.includes("refresh")) { status = 401; data = {}; }
    else if (url.pathname === "/me/library-stats") data = { bookCount: cold ? 0 : 1, cardCount: cold ? 0 : 3 };
    else if (url.pathname === "/me/home-summary") data = { revisitCards: cold ? [] : [card], currentReadingBooks: cold ? [] : [book], recentRecordedBooks: cold ? [] : [book], deckSuggestions: [] };
    else if (url.pathname === "/decks") {
      assert.ok(["3", "8", "24"].includes(url.searchParams.get("take")));
      const published = url.searchParams.get("status") === "published";
      status = state.drafts === "error" ? 500 : 200;
      data = { items: state.drafts === "success" ? [{ id: published ? 9 : 8, name: published ? "완성한 독서 기록" : "습관과 환경의 연결", mode: "graph", status: published ? "published" : "draft", updatedAt: "2026-09-20", nodeCount: 3, connectionCount: 2, preview: null }] : [], meta: { nextCursor: null, total: state.drafts === "success" ? 1 : 0 } };
    } else if (url.pathname === "/books") data = { items: [book], meta: { page: 1, totalPages: 1, total: 1, take: 20 } };
    else { state.unknown.push(url.pathname); status = 500; data = {}; }
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
  });
  return { context, page, state };
}

try {
  for (const width of [320, 390, 1280]) {
    const { context, page, state } = await fixture({ signedIn: false, width });
    await page.goto(origin);
    await page.getByRole("link", { name: "시작하기", exact: true }).waitFor();
    await closeDevtools(page);
    assert.equal(await page.getByRole("navigation", { name: "모바일 내비게이션" }).count(), 0);
    assert.equal(await page.locator("header").getByRole("link", { name: "시작하기", exact: true }).getAttribute("href"), "/login");
    await page.getByRole("link", { name: "사용 방법", exact: true }).filter({ visible: true }).click();
    await page.waitForURL(`${origin}/#how-it-works`);
    const anchor = await page.locator("#how-it-works").boundingBox();
    const header = await page.locator("header").boundingBox();
    assert.ok(anchor.y >= header.height - 1, "앵커 제목이 고정 헤더에 가리지 않는다");
    await page.evaluate(checkNavigation);
    await page.screenshot({ path: `/private/tmp/readingdeck-landing-${width}.png`, fullPage: false });
    assert.deepEqual(state.unknown, []);
    await context.close();
  }

  for (const width of [390, 1280]) {
    const { context, page, state } = await fixture({ width });
    await page.goto(origin);
    const entry = page.locator("header").getByRole("link", { name: "내 기록으로", exact: true });
    await entry.waitFor();
    assert.equal(new URL(page.url()).pathname, "/", "로그인한 방문자도 랜딩을 볼 수 있다");
    await entry.click();
    await page.getByRole("heading", { name: "홈", exact: true }).waitFor();
    await page.getByRole("heading", { name: "습관과 환경의 연결" }).waitFor();
    await closeDevtools(page);
    assert.equal(await page.getByRole("link", { name: /습관과 환경의 연결/ }).getAttribute("href"), "/decks/8/edit");
    await page.evaluate(checkNavigation);
    if (width === 390) await page.locator("header").getByRole("button", { name: "다크 모드로 전환" }).click();
    await page.screenshot({ path: `/private/tmp/readingdeck-home-${width}.png`, fullPage: true, animations: "disabled" });
    const nav = page.getByRole("navigation", { name: width < 768 ? "모바일 내비게이션" : "메인 네비게이션" });
    await nav.getByRole("link", { name: "내 서재", exact: true }).click();
    await page.waitForURL(`${origin}/books/library`);
    await page.evaluate(checkNavigation);
    await nav.getByRole("link", { name: "내 덱", exact: true }).click();
    await page.getByRole("heading", { name: "내 덱", exact: true }).waitFor();
    await page.getByRole("heading", { name: "작성 중인 덱", exact: true }).waitFor();
    await page.getByRole("heading", { name: "저장한 덱", exact: true }).waitFor();
    await page.getByRole("heading", { name: "완성한 독서 기록", exact: true }).waitFor();
    await page.evaluate(checkNavigation);
    await page.screenshot({ path: `/private/tmp/readingdeck-decks-${width}.png`, fullPage: true, animations: "disabled" });
    assert.deepEqual(state.unknown, []);
    await context.close();
  }

  for (const drafts of ["empty", "error"]) {
    const { context, page, state } = await fixture({ drafts });
    await page.goto(`${origin}/books`);
    await page.getByRole("heading", { name: "홈", exact: true }).waitFor();
    await closeDevtools(page);
    if (drafts === "empty") await page.getByRole("link", { name: "덱 만들기", exact: true }).waitFor();
    else {
      await page.getByText("작성 중인 덱을 불러오지 못했어요.").waitFor();
      state.drafts = "success";
      await page.getByRole("button", { name: "다시 불러오기", exact: true }).click();
      await page.getByRole("heading", { name: "습관과 환경의 연결" }).waitFor();
    }
    assert.deepEqual(state.unknown, []);
    await context.close();
  }
  const { context, page, state } = await fixture({ cold: true });
  await page.goto(`${origin}/books`);
  await page.getByRole("button", { name: "첫 책 추가하기" }).waitFor();
  assert.equal(await page.getByRole("heading", { name: "작성 중인 덱" }).count(), 0);
  assert.deepEqual(state.unknown, []);
  await context.close();
  console.log("PASS: 랜딩/앱 진입·로그인 전후·앵커·모바일 메뉴/활성 상태·내 덱·초안 성공/빈 목록/재시도·신규 사용자");
} finally {
  await browser.close();
}
