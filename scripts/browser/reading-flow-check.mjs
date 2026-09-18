// Install mock as an init script in an isolated browser context. Start at
// /books/library, run createBookAndCard(), then createAndShareDeck().
// All XHR is intercepted. State survives navigation through sessionStorage.
export function mock() {
  const state = JSON.parse(sessionStorage.getItem("reading-flow") || "null") || { book: null, cards: [], deck: null, writes: [], unexpected: [] };
  window.flowCheck = state;
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this.flowMethod = method.toUpperCase();
    this.flowPath = new URL(url, location.href).pathname;
    return open.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function (raw) {
    const method = this.flowMethod;
    const path = this.flowPath;
    const body = raw instanceof FormData ? Object.fromEntries(raw.entries()) : raw ? JSON.parse(raw) : {};
    let data;
    let status = 200;
    const now = "2026-09-19T00:00:00.000Z";
    if (method !== "GET") state.writes.push({ method, path, body });
    if (method === "POST" && path === "/books") {
      state.book = { ...body, id: 1, backgroundImage: null, status: "reading", progressPercent: 0, cardCount: 0, createdAt: now };
      data = state.book;
    } else if (method === "POST" && path === "/books/1/cards") {
      data = { ...body, id: state.cards.length + 1, book: state.book, title: body.title || null, quote: body.quote || null, pageStart: body.pageStart ?? null, pageEnd: body.pageEnd ?? null, createdAt: now, version: 1 };
      state.cards.push(data);
      state.book.cardCount = state.cards.length;
    } else if (method === "POST" && path === "/decks") {
      state.deck = { ...body, id: 1, status: "draft", createdAt: now, updatedAt: now, isShared: false, connections: body.connections || [], nodes: (body.nodes || []).map((node, index) => ({ ...node, id: index + 1, card: state.cards.find(card => card.id === node.cardId), book: state.book })) };
      data = state.deck;
    } else if (method === "POST" && path === "/decks/1/publish") {
      state.deck = { ...state.deck, ...body, status: "published" };
      data = state.deck;
    } else if (method === "POST" && path === "/community/posts") {
      state.deck.isShared = true;
      state.deck.sharedPostId = 1;
      data = { id: 1, deckId: 1, caption: body.caption };
    } else if (method === "GET") {
      const routes = {
        "/me": { id: 1, name: "Preview", email: "preview@example.com", profile: null },
        "/me/library-stats": { bookCount: state.book ? 1 : 0, cardCount: state.cards.length },
        "/books": { items: state.book ? [state.book] : [], meta: { total: state.book ? 1 : 0, page: 1, take: 12, totalPages: 1 } },
        "/books/1": state.book,
        "/books/1/cards": { items: state.cards, nextCursor: null, hasNext: false },
        "/decks/1": state.deck,
        "/decks": { items: state.deck ? [state.deck] : [], meta: { total: state.deck ? 1 : 0, take: 12, nextCursor: null } },
      };
      data = routes[path];
    }
    if (data === undefined) { state.unexpected.push(`${method} ${path}`); status = 500; data = { message: "Unhandled test endpoint" }; }
    sessionStorage.setItem("reading-flow", JSON.stringify(state));
    setTimeout(() => {
      Object.defineProperties(this, { status: { value: status }, statusText: { value: String(status) }, readyState: { value: 4 }, responseText: { value: JSON.stringify(data) }, response: { value: JSON.stringify(data) } });
      for (const event of ["readystatechange", "load", "loadend"]) this.dispatchEvent(new Event(event));
    }, 200);
  };
}

export async function createBookAndCard() {
  const wait = async condition => {
    const end = Date.now() + 10000;
    while (!condition()) {
      if (Date.now() > end) throw new Error("Timed out waiting for book/card UI");
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  };
  const button = text => [...document.querySelectorAll("button")].find(el => el.textContent.trim().endsWith(text));
  const fill = (el, value) => {
    const prototype = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  await wait(() => button("새 책 추가"));
  document.querySelector('[aria-label="Close tanstack query devtools"]')?.click();
  button("새 책 추가").click();
  await wait(() => button("직접 입력"));
  button("직접 입력").click();
  await wait(() => document.querySelector('input[id$="-title"]'));
  fill(document.querySelector('input[id$="-title"]'), "흐름 검증용 책");
  fill(document.querySelector('input[id$="-author"]'), "테스트 작가");
  await wait(() => !button("서재에 추가").disabled);
  button("서재에 추가").click();
  await wait(() => location.pathname === "/books/1" && button("카드 추가"));
  button("카드 추가").click();
  await wait(() => document.querySelector('[role="dialog"] textarea'));
  const fields = [...document.querySelectorAll('[role="dialog"] textarea')];
  fill(fields[0], "책에서 발견한 문장입니다.");
  fill(fields.at(-1), "이 문장을 작은 실천으로 옮겨보기로 했습니다.");
  await wait(() => !button("카드 저장").disabled);
  button("카드 저장").click();
  await wait(() => !document.querySelector('[role="dialog"]') && document.querySelector('[aria-controls="book-card-1-content"]'));
  if (window.flowCheck.book.title !== "흐름 검증용 책" || window.flowCheck.cards.length !== 1) throw new Error("Book/card state mismatch");
  if (window.flowCheck.unexpected.length) throw new Error(window.flowCheck.unexpected.join(", "));
  return "PASS: manual book creation, detail navigation, card creation, list refresh";
}

export async function createAndShareDeck() {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const wait = async condition => {
    const end = Date.now() + 10000;
    while (!condition()) {
      assert(Date.now() < end, "Timed out waiting for deck/share UI");
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  };
  const button = text => [...document.querySelectorAll("button")].find(el => el.textContent.trim() === text);
  document.querySelector('a[href="/decks"]').click();
  await wait(() => location.pathname === "/decks");
  const create = () => [...document.querySelectorAll("a,button")].find(el => el.textContent.trim().endsWith("새 덱 만들기"));
  await wait(create);
  create().click();
  await wait(() => location.pathname === "/decks/create" && document.querySelector("aside article"));
  assert(button("발행하기").disabled, "Empty deck must not publish");
  document.querySelector("aside article").click();
  await wait(() => document.querySelector("aside article")?.textContent.includes("이 문장을 작은 실천"));
  document.querySelector("aside article").click();
  await wait(() => !button("발행하기").disabled);
  button("발행하기").click();
  await wait(() => location.pathname === "/decks/1" && button("커뮤니티 공유"));
  assert(document.querySelector("main").textContent.includes("책에서 발견한 문장입니다."), "Published deck must include the original quote");
  button("커뮤니티 공유").click();
  await wait(() => document.querySelector('[role="dialog"] textarea'));
  assert(!window.flowCheck.deck.isShared, "Opening the dialog must not publish the share");
  const textarea = document.querySelector('[role="dialog"] textarea');
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(textarea, "함께 읽고 싶은 문장입니다.");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  await wait(() => document.querySelector('[role="dialog"]').textContent.includes("15 / 280"));
  button("공유하기").click();
  await wait(() => !document.querySelector('[role="dialog"]') && button("공유 취소"));
  const { writes, unexpected, deck } = window.flowCheck;
  assert(JSON.stringify(writes.map(request => request.path)) === JSON.stringify(["/books", "/books/1/cards", "/decks", "/decks/1/publish", "/community/posts"]), "Unexpected write order or duplicate write");
  assert(writes[2].body.nodes[0].cardId === window.flowCheck.cards[0].id, "Deck must contain the created card");
  assert(writes[4].body.deckId === deck.id && writes[4].body.caption === "함께 읽고 싶은 문장입니다.", "Share payload mismatch");
  assert(deck.status === "published" && deck.isShared, "Final deck status mismatch");
  assert(!unexpected.length, unexpected.join(", "));
  return "PASS: empty guard, import created card, save before publish, detail, share confirmation, payloads, no duplicate writes";
}
