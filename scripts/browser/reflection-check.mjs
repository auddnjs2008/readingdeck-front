// Run with PLAYWRIGHT_MODULE pointing to an existing Playwright installation.
// HTTP boundary fixtures only: never writes to a real backend.
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const origin = process.env.CHECK_ORIGIN || "http://localhost:4000";
const now = "2026-09-20T00:00:00.000Z";
const book = {
  id: 1,
  title: "습관에 관한 책",
  author: "첫 작가",
  publisher: "출판사",
  cardCount: 1,
  status: "reading",
  createdAt: now,
};
const otherBook = {
  ...book,
  id: 2,
  title: "집중에 관한 책",
  author: "둘째 작가",
};
const card = {
  id: 1,
  type: "insight",
  thought: "목표보다 시스템이 중요하다",
  quote: "작은 습관",
  book,
  createdAt: now,
  updatedAt: now,
  revisitCount: 0,
  title: null,
  pageStart: null,
  pageEnd: null,
};
const other = {
  ...card,
  id: 2,
  thought: "집중하는 환경을 만들자",
  book: otherBook,
};

const deckFixture = (id, label = "이어져요", type = "extends") => ({
  id, name: "생각 연결 덱", description: null, status: "draft", mode: "graph", version: 1, updatedAt: now, createdAt: now,
  nodes: [card, other].map((item, index) => ({ id: index + 1, clientKey: `card-${item.id}`, type: "card", cardId: item.id, bookId: item.book.id, card: item, book: item.book, order: index, positionX: index * 400, positionY: 0 })),
  connections: [{ id: 1, fromNodeId: 1, toNodeId: 2, type, label }],
});

async function fixture({ mobile = false, relatedFails = false } = {}) {
  const context = await browser.newContext({
    viewport: mobile
      ? { width: 390, height: 844 }
      : { width: 1280, height: 960 },
  });
  const page = await context.newPage();
  const devtoolsClose = page.getByRole("button", { name: "Close tanstack query devtools", exact: true });
  await page.addLocatorHandler(devtoolsClose, async () => { await devtoolsClose.click(); });
  const state = {
    reflections: [],
    historyReads: 0,
    writes: [],
    unknown: [],
    failReflection: true,
    failDeck: true,
  };
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (request.resourceType() !== "xhr") {
      if (url.origin === origin || url.protocol === "data:")
        return route.continue();
      return route.abort();
    }
    const path = url.pathname;
    const method = request.method();
    const body = request.postDataJSON();
    let data;
    let status = 200;
    if (method !== "GET") state.writes.push({ path, body, method });
    if (path === "/me")
      data = {
        id: 7,
        name: "검증 사용자",
        email: "check@example.com",
        profile: null,
      };
    else if (path === "/cards/1") { status = state.failCard ? 500 : 200; data = state.failCard ? { message: "fixture failure" } : { ...card, thought: state.longCard ? `${card.thought}\n`.repeat(50) : card.thought }; }
    else if (path === "/cards/1/reflections" && method === "GET") {
      state.historyReads++;
      data = { items: state.reflections, nextCursor: null };
    }
    else if (path === "/cards/1/reflections" && method === "POST") {
      if (state.failReflection) {
        state.failReflection = false;
        status = 500;
        data = { message: "fixture failure" };
      } else {
        data = { ...body, id: 1, createdAt: now };
        state.reflections = [data];
      }
    } else if (path === "/cards/1/reflections/1" && method === "DELETE") {
      if (state.failDelete) status = 500;
      else state.reflections = [];
      data = {};
    } else if (path === "/cards/1/related") {
      status = relatedFails ? 503 : 200;
      data = {
        items: [
          {
            ...other,
            bookId: 2,
            bookTitle: otherBook.title,
            author: otherBook.author,
          },
        ],
      };
    } else if (path === "/books")
      data = {
        items: [book, otherBook],
        meta: { page: 1, totalPages: 1, total: 2, take: 20 },
      };
    else if (path === "/books/2/cards")
      data = { items: [other], nextCursor: null, hasNext: false };
    else if (path === "/books/1") data = book;
    else if (path === "/books/1/cards") data = { items: [{ ...card, reflectionCount: state.reflections.length }], nextCursor: null, hasNext: false };
    else if (path === "/decks/9") data = deckFixture(9);
    else if (path === "/decks/8") data = deckFixture(8, "반대돼요", "opposite");
    else if (path === "/decks/9/graph" && method === "PUT") data = { ...deckFixture(9), version: 2 };
    else if (path === "/decks" && method === "GET")
      data = {
        items: [
          {
            id: 8,
            name: "기존 생각 덱",
            mode: "graph",
            status: "draft",
            isShared: false,
          },
        ],
        meta: { nextCursor: null, total: 1 },
      };
    else if (path === "/decks" && method === "POST") {
      if (state.failDeck) {
        state.failDeck = false;
        status = 500;
        data = {};
      } else data = { id: 9, ...body, version: 1 };
    } else if (path === "/decks/8/card-connections")
      data = { deckId: 8, alreadyConnected: false };
    else if (path === "/cards/1/revisit") {
      state.revisited = true;
      data = { ...card, revisitCount: 1 };
    }
    else if (path === "/me/library-stats")
      data = { bookCount: 2, cardCount: 2 };
    else if (path === "/me/home-summary")
      data = {
        revisitCards: (state.changingStack
          ? state.revisited ? [other] : [other, card]
          : [card]).map(item => ({ ...item, reason: "never_revisited" })),
        currentReadingBooks: [],
        recentRecordedBooks: [],
        deckSuggestions: [],
      };
    else {
      state.unknown.push(`${method} ${path}`);
      status = 500;
      data = { message: "Unhandled test API" };
    }
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(data),
    });
  });
  await page.goto(`${origin}/cards/1`);
  await page.getByRole("heading", { name: "처음 남긴 생각", exact: true }).waitFor();
  await page.getByText(card.thought, { exact: true }).waitFor();
  assert.ok(await page.locator("article").first().evaluate(element => element.innerText.indexOf("원문 인용") < element.innerText.indexOf("처음 남긴 생각")), "일반 상세는 원문 다음에 내 생각을 보여준다");
  assert.equal(await page.getByRole("button", { name: "지금의 생각 저장" }).count(), 0, "상세보기에는 반응 입력 폼이 없다");
  await page.goto(`${origin}/cards/1?mode=reflect`);
  await page
    .getByRole("heading", { name: "지금 이 생각은 어떤가요?" })
    .waitFor();
  const devtools = page.getByRole("button", {
    name: "Close tanstack query devtools",
    exact: true,
  });
  if (await devtools.isVisible()) await devtools.click();
  return { page, context, state };
}

async function reflect(page, state) {
  await page.getByLabel("생각이 달라졌어요", { exact: true }).check();
  await page
    .getByLabel("한 줄 덧붙이기", { exact: false })
    .fill("점심 이후 20분이 더 잘 맞았다.");
  await page
    .getByRole("button", { name: "지금의 생각 저장", exact: true })
    .click();
  await page.getByText("반응을 저장하지 못했어요.", { exact: false }).waitFor();
  assert.equal(
    await page.getByLabel("한 줄 덧붙이기", { exact: false }).inputValue(),
    "점심 이후 20분이 더 잘 맞았다.",
  );
  await page
    .getByRole("button", { name: "지금의 생각 저장", exact: true })
    .click();
  await page.getByText("오늘의 생각을 남겼어요.", { exact: true }).waitFor();
  assert.equal(await page.getByRole("button", { name: "지금의 생각 저장" }).count(), 0, "저장 후에는 입력 폼을 완료 화면으로 교체한다");
  assert.equal(await page.getByRole("heading", { name: "다시 읽고 남긴 생각" }).count(), 0);
  await page.getByRole("button", { name: "마치기", exact: true }).waitFor();
  const reflections = state.writes.filter(write => write.path.endsWith("/reflections"));
  assert.equal(reflections[0].body.requestId, reflections[1].body.requestId);
  assert.equal(
    state.writes.filter((w) => w.path.includes("/decks")).length,
    0,
    "반응 저장만으로 완료 가능",
  );
  await page.getByRole("button", { name: "다른 카드와 연결하기" }).click();
}

try {
  const first = await fixture();
  await reflect(first.page, first.state);
  await first.page
    .getByRole("button", { name: /집중에 관한 책.*집중하는 환경/ })
    .click();
  await first.page.getByLabel("이어져요", { exact: true }).check();
  assert.equal(await first.page.getByRole("button", { name: "직접 찾기", exact: true }).count(), 0, "관계 선택 중에는 카드 탐색을 숨긴다");
  await first.page.getByRole("button", { name: "카드 다시 고르기" }).click();
  await first.page.getByRole("button", { name: /집중에 관한 책.*집중하는 환경/ }).click();
  await first.page.getByLabel("이어져요", { exact: true }).check();
  await first.page
    .getByRole("button", { name: "연결 저장", exact: true })
    .click();
  await first.page
    .getByText("연결을 저장하지 못했어요.", { exact: false })
    .waitFor();
  await first.page
    .getByRole("button", { name: "연결 저장", exact: true })
    .click();
  await first.page.getByRole("link", { name: "연결된 덱 보기" }).waitFor();
  const creates = first.state.writes.filter((w) => w.path === "/decks");
  assert.equal(creates.length, 2);
  assert.equal(creates[0].body.requestId, creates[1].body.requestId);
  assert.deepEqual(
    creates[1].body.nodes.map((n) => n.cardId),
    [1, 2],
  );
  assert.equal(creates[1].body.connections[0].label, "이어져요");
  assert.equal(creates[1].body.status, "draft");
  assert.ok(
    !JSON.stringify(creates[1].body).includes("점심 이후"),
    "개인 반응을 덱에 복사하지 않는다",
  );
  await first.page.getByRole("link", { name: "연결된 덱 보기" }).click();
  await first.page.getByText("이어져요", { exact: true }).waitFor();
  // React Flow's canvas node is a technical drag target, not a form control.
  const node = await first.page.locator(".react-flow__node").first().boundingBox();
  assert.ok(node);
  await first.page.mouse.move(node.x + 30, node.y + 25);
  await first.page.mouse.down();
  await first.page.mouse.move(node.x + 60, node.y + 50, { steps: 5 });
  await first.page.mouse.up();
  const graphResponse = first.page.waitForResponse(response => response.url().endsWith("/decks/9/graph") && response.request().method() === "PUT");
  await first.page.getByRole("button", { name: "덱 저장", exact: true }).click();
  await graphResponse;
  const graphSave = first.state.writes.find(write => write.path === "/decks/9/graph");
  assert.equal(graphSave.body.connections[0].type, "extends", "덱 편집 후에도 관계 유형을 유지한다");
  assert.equal(graphSave.body.connections[0].label, "이어져요");
  assert.equal(graphSave.body.expectedVersion, 1);
  await first.page.goto(`${origin}/cards/1`);
  await first.page.getByText("점심 이후 20분이 더 잘 맞았다.", { exact: true }).waitFor();
  await first.page.getByRole("button", { name: "삭제", exact: true }).click();
  const confirmation = first.page.getByRole("alertdialog");
  await confirmation.getByRole("button", { name: "취소", exact: true }).click();
  assert.equal(first.state.writes.filter(item => item.method === "DELETE").length, 0, "취소하면 삭제 요청을 보내지 않는다");
  await first.page.getByRole("button", { name: "삭제", exact: true }).click();
  first.state.failDelete = true;
  await confirmation.getByRole("button", { name: "삭제하기", exact: true }).click();
  await confirmation.getByRole("alert").waitFor();
  first.state.failDelete = false;
  await confirmation.getByRole("button", { name: "삭제하기", exact: true }).click();
  await first.page.getByText("다시 읽으니 어떤 생각이 드나요?").waitFor();
  assert.deepEqual(first.state.unknown, []);
  await first.context.close();

  const second = await fixture({ mobile: true, relatedFails: true });
  await reflect(second.page, second.state);
  await second.page
    .getByRole("button", { name: "직접 찾기", exact: true })
    .click();
  await second.page
    .getByRole("button", { name: "집중에 관한 책", exact: true })
    .click();
  await second.page
    .getByRole("button", { name: /집중에 관한 책.*집중하는 환경/ })
    .click();
  await second.page.getByLabel("반대돼요", { exact: true }).check();
  await second.page.getByLabel("저장할 덱", { exact: true }).selectOption("8");
  await second.page
    .getByRole("button", { name: "연결 저장", exact: true })
    .click();
  await second.page.getByRole("link", { name: "연결된 덱 보기" }).waitFor();
  assert.deepEqual(
    second.state.writes.find((w) => w.path.endsWith("card-connections")).body,
    { fromCardId: 1, toCardId: 2, relation: "opposite" },
  );
  assert.ok(
    await second.page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await second.page.screenshot({
    path: "/private/tmp/readingdeck-reflection-mobile.png",
    fullPage: true,
  });
  await second.page.getByRole("link", { name: "연결된 덱 보기" }).click();
  await second.page.getByText("→ 반대돼요", { exact: true }).waitFor();
  assert.deepEqual(second.state.unknown, []);
  await second.context.close();

  const third = await fixture();
  await third.page.goto(`${origin}/books`);
  await third.page.getByRole("button", { name: "지금의 생각 남기기" }).click();
  await third.page.getByRole("dialog").waitFor();
  await third.page.getByLabel("여전히 동의해요", { exact: true }).check();
  third.page.once("dialog", (dialog) => dialog.dismiss());
  await third.page.getByRole("button", { name: "Close", exact: true }).click();
  assert.equal(
    await third.page.getByRole("dialog").count(),
    1,
    "닫기를 취소하면 입력을 유지한다",
  );
  assert.equal(
    await third.page.getByLabel("여전히 동의해요", { exact: true }).isChecked(),
    true,
  );
  let confirmations = 0;
  third.page.on("dialog", async (dialog) => {
    confirmations += 1;
    await dialog.accept();
  });
  await third.page.getByRole("button", { name: "Close", exact: true }).click();
  await third.page.waitForURL(`${origin}/books`);
  assert.equal(confirmations, 1, "미저장 모달을 닫을 때 확인은 한 번만 한다");
  await third.page.getByRole("button", { name: "지금의 생각 남기기" }).click();
  await reflect(third.page, third.state);
  await third.page.getByRole("button", { name: "완료 화면으로" }).click();
  await third.page.getByRole("button", { name: "마치기", exact: true }).click();
  await third.page.waitForURL(`${origin}/books`);
  assert.equal(confirmations, 1, "저장한 반응은 추가 확인 없이 마칠 수 있다");
  third.state.failCard = true;
  await third.page.goto(`${origin}/books`);
  await third.page.getByRole("button", { name: "지금의 생각 남기기" }).click();
  await third.page.getByRole("dialog").getByText("정보를 불러오지 못했습니다.").waitFor();
  await third.page.getByRole("button", { name: "Close", exact: true }).click();
  await third.page.waitForURL(`${origin}/books`);
  assert.deepEqual(third.state.unknown, []);
  await third.context.close();
  const fourth = await fixture();
  fourth.state.changingStack = true;
  fourth.state.longCard = true;
  await fourth.page.goto(`${origin}/books`);
  await fourth.page.getByRole("button", { name: "다음 카드", exact: true }).click();
  const selectedSlide = fourth.page.locator(".embla__slide").filter({ hasText: card.thought });
  const refreshed = fourth.page.waitForResponse(response => response.url().endsWith("/me/home-summary") && fourth.state.revisited);
  await selectedSlide.getByText(card.thought, { exact: true }).click();
  await fourth.page.getByRole("dialog").waitFor();
  await refreshed;
  const scroller = fourth.page.getByRole("dialog").locator(".custom-scrollbar");
  await scroller.evaluate(element => { element.scrollTop = 0; });
  const modalArticle = fourth.page.getByRole("dialog").locator("article").first();
  assert.ok(await modalArticle.evaluate(element => element.innerText.indexOf("원문 인용") < element.innerText.indexOf("처음 남긴 생각")), "모달 상세도 원문 다음에 내 생각을 보여준다");
  const textBounds = await modalArticle.locator("section").filter({ has: fourth.page.getByRole("heading", { name: "처음 남긴 생각" }) }).locator("p").boundingBox();
  await fourth.page.mouse.move(textBounds.x + 30, textBounds.y + 15);
  await fourth.page.mouse.wheel(0, 240);
  await fourth.page.waitForFunction(() => document.querySelector('[role="dialog"] .custom-scrollbar')?.scrollTop > 0, { }, { timeout: 2000 });
  await fourth.page.getByRole("button", { name: "Close", exact: true }).click();
  await fourth.page.waitForURL(`${origin}/books`);
  assert.equal(await selectedSlide.count(), 1, "재방문 후 추천이 바뀌어도 읽던 카드를 유지한다");
  const slideBounds = await selectedSlide.boundingBox();
  const viewportBounds = await fourth.page.locator(".embla__viewport").boundingBox();
  assert.ok(Math.abs(slideBounds.x - viewportBounds.x) < 5, "첫 장으로 돌아가지 않고 선택한 위치를 유지한다");
  fourth.state.failReflection = false;
  await selectedSlide.getByRole("button", { name: "지금의 생각 남기기" }).click();
  await fourth.page.getByLabel("여전히 동의해요", { exact: true }).check();
  await fourth.page.getByRole("button", { name: "지금의 생각 저장", exact: true }).click();
  await fourth.page.getByRole("button", { name: "마치기", exact: true }).click();
  await fourth.page.waitForURL(`${origin}/books`);
  const savedBounds = await selectedSlide.boundingBox();
  assert.ok(savedBounds && Math.abs(savedBounds.x - viewportBounds.x) < 5, "생각을 저장하고 마쳐도 읽던 카드 위치를 유지한다");
  await fourth.page.reload();
  await fourth.page.locator(".embla__slide").getByText(other.thought, { exact: true }).waitFor();
  assert.equal(await selectedSlide.count(), 0, "홈을 새로 열면 최신 추천을 보여준다");
  assert.deepEqual(fourth.state.unknown, []);
  await fourth.context.close();
  for (const mobile of [false, true]) {
    const { page, context, state } = await fixture({ mobile });
    state.reflections = [{ id: 1, reaction: "tried", note: "작게 실천해 보니 달랐다", createdAt: now }];
    state.failReflection = false;
    state.historyReads = 0;
    await page.goto(`${origin}/books/1`);
    const toggle = page.getByRole("button", { name: /인사이트.*목표보다 시스템이 중요하다/ });
    await toggle.waitFor();
    const devtools = page.getByRole("button", { name: "Close tanstack query devtools", exact: true });
    if (await devtools.isVisible()) await devtools.click();
    assert.match(await toggle.innerText(), /다시 남긴 생각 1개/);
    assert.equal(state.historyReads, 0, "접힌 카드에서는 반응 이력을 요청하지 않는다");
    await toggle.click();
    await page.getByText("작게 실천해 보니 달랐다", { exact: true }).waitFor();
    await page.getByText("처음 남긴 생각", { exact: true }).waitFor();
    await page.getByRole("link", { name: "생각 남기기", exact: true }).click();
    await page.getByRole("dialog").waitFor();
    await page.getByLabel("생각이 달라졌어요", { exact: true }).check();
    await page.getByRole("button", { name: "지금의 생각 저장", exact: true }).click();
    await page.getByRole("button", { name: "마치기", exact: true }).click();
    await page.waitForURL(`${origin}/books/1`);
    assert.equal(await toggle.getAttribute("aria-expanded"), "true", "모달을 닫아도 카드는 펼친 상태로 유지된다");
    await page.getByText("· 생각이 달라졌어요", { exact: true }).waitFor();
    await page.getByRole("button", { name: "삭제", exact: true }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "삭제하기", exact: true }).click();
    await page.getByText("다시 읽으니 어떤 생각이 드나요?", { exact: true }).waitFor();
    await toggle.click();
    await page.waitForFunction(() => !document.body.innerText.includes("다시 남긴 생각 1개"));
    assert.deepEqual(state.unknown, []);
    await context.close();
  }
  console.log(
    "PASS: 반응 실패/재시도·이력 삭제·신규 덱 재시도·후보 실패 시 직접 선택·기존 덱 연결·모바일·모달 미저장 보호·재추천 후 카드/위치 유지",
  );
} finally {
  await browser.close();
}
