import { deckFixture } from "./deck-detail-check.mjs";

export const fixture = { ...deckFixture, id: 1, status: "draft", mode: "list", nodes: deckFixture.nodes.map(node => ({ ...node, cardId: node.id })) };

// Browser-only transport mock. No XHR is sent; sessionStorage simulates reopening.
export function mock(initialDeck) {
  const deck = JSON.parse(sessionStorage.getItem("save-deck") || "null") || initialDeck;
  const cards = initialDeck.nodes.map(node => node.card);
  const state = window.saveCheck = { deck, writes: [], pending: [], hold: false, fail: false, unexpected: [] };
  state.release = () => state.pending.splice(0).forEach(finish => finish());
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this.testMethod = method.toUpperCase();
    this.testPath = new URL(url, location.href).pathname;
    return open.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function (raw) {
    const method = this.testMethod;
    const path = this.testPath;
    const body = raw ? JSON.parse(raw) : {};
    const write = method !== "GET";
    if (write) state.writes.push({ method, path, body });
    const finish = () => {
      let status = write && state.fail ? 500 : 200;
      let data;
      if (status === 500) data = { message: "Test save failure" };
      else if (method === "POST" && path === "/decks") data = Object.assign(deck, body, { id: 1, status: "draft", nodes: body.nodes.map((node, index) => ({ ...node, id: index + 1, card: cards.find(card => card.id === node.cardId), book: initialDeck.nodes[0]?.book })) });
      else if (method === "PATCH" && path === "/decks/1") data = Object.assign(deck, body);
      else if (method === "PUT" && path === "/decks/1/graph") {
        const oldNodes = deck.nodes;
        deck.nodes = body.nodes.map((node, index) => ({ ...oldNodes.find(old => old.cardId === node.cardId), ...node, id: index + 1 }));
        deck.connections = body.connections.map((edge, index) => ({ ...edge, id: index + 1, fromNodeId: deck.nodes.find(node => node.clientKey === edge.fromNodeClientKey).id, toNodeId: deck.nodes.find(node => node.clientKey === edge.toNodeClientKey).id }));
        data = deck;
      } else if (method === "POST" && path === "/decks/1/publish") data = Object.assign(deck, body, { status: "published" });
      else if (method === "GET") {
        if (path === "/decks/1") data = deck;
        if (path === "/me") data = { id: 1, name: "Preview" };
        if (path === "/books" || path === "/decks") data = { items: [], meta: { total: 0, totalPages: 0 }, nextCursor: null };
        if (path === "/books") data = { items: [{ id: 1, title: "테스트 책", author: "작가", cardCount: cards.length }], meta: { total: 1, totalPages: 1 } };
        if (path === "/books/1/cards") data = { items: cards, nextCursor: null, hasNext: false };
      }
      if (!data) { state.unexpected.push(`${method} ${path}`); status = 500; data = {}; }
      sessionStorage.setItem("save-deck", JSON.stringify(deck));
      Object.defineProperties(this, { status: { value: status }, statusText: { value: String(status) }, readyState: { value: 4 }, response: { value: JSON.stringify(data) }, responseText: { value: JSON.stringify(data) } });
      for (const event of ["readystatechange", "load", "loadend"]) this.dispatchEvent(new Event(event));
    };
    if (write && state.hold) state.pending.push(finish);
    else setTimeout(finish, 50);
  };
}

export async function checkSave() {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const wait = async condition => {
    const deadline = Date.now() + 7000;
    while (!condition()) {
      assert(Date.now() < deadline, "덱 저장 UI 대기 시간 초과");
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  const edit = () => document.querySelector('[aria-label="덱 정보 편집"]');
  const save = () => document.querySelector('[aria-label="덱 저장"]');
  const button = text => [...document.querySelectorAll("button")].find(el => el.textContent.trim() === text);
  await wait(edit);
  document.querySelector('[aria-label="Close tanstack query devtools"]')?.click();
  edit().click();
  await wait(() => document.querySelector('[placeholder="덱 제목"]'));
  const field = document.querySelector('[placeholder="덱 제목"]');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(field, "저장 실패 후에도 남을 제목");
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await wait(() => field.value === "저장 실패 후에도 남을 제목");
  button("적용").click();
  await wait(() => !save().disabled);
  window.saveCheck.hold = true;
  window.saveCheck.fail = true;
  save().click();
  await wait(() => window.saveCheck.pending.length === 1);
  assert(save().disabled, "저장 중 재전송은 비활성화되어야 한다");
  assert(edit().disabled, "저장 응답이 편집 내용을 덮어쓰지 않도록 저장 중 정보 편집을 막아야 한다");
  assert(document.querySelector('[aria-busy="true"][inert]'), "저장 중 캔버스 편집도 잠겨야 한다");
  window.saveCheck.release();
  await wait(() => !save().disabled);
  assert(document.querySelector("header h1").textContent === "저장 실패 후에도 남을 제목", "실패해도 제목을 유지해야 한다");
  assert(document.body.textContent.includes("저장 실패"), "저장 실패를 표시해야 한다");
  window.saveCheck.fail = false;
  window.saveCheck.hold = false;
  save().click();
  await wait(() => window.saveCheck.deck.name === "저장 실패 후에도 남을 제목" && !edit().disabled);
  assert(save().disabled, "저장 후 변경 없음 상태여야 한다");
  assert(window.saveCheck.writes.length === 2, "실패와 재시도 외 중복 요청이 없어야 한다");
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  assert(!event.defaultPrevented, "저장 완료 후에는 이탈 경고를 해제해야 한다");
  return "PASS: 저장 잠금, 실패 시 내용 보존, 재시도, 중복 요청 방지, 저장 후 경고 해제";
}

export async function checkLeave() {
  const remove = document.querySelector('button[aria-label="덱에서 카드 제거"]');
  if (!remove) throw new Error("카드가 있는 목록 덱에서 실행하세요");
  remove.click();
  await new Promise(resolve => setTimeout(resolve, 100));
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  if (!event.defaultPrevented) throw new Error("저장하지 않은 카드 변경이 있으면 새로고침을 경고해야 한다");
  const original = window.confirm;
  let confirmed = false;
  window.confirm = () => { confirmed = true; return false; };
  try {
    document.querySelector('a[aria-label="나의 덱"]').click();
    if (!confirmed) throw new Error("나의 덱 이동 전에 저장하지 않은 변경을 경고해야 한다");
    if (!location.pathname.endsWith("/edit")) throw new Error("취소하면 편집 화면을 유지해야 한다");
  } finally { window.confirm = original; }
  return "PASS: 새로고침 경고, 목록 이동 취소";
}

export async function checkHistory() {
  const rows = () => [...document.querySelectorAll('article[aria-label^="카드 "]')];
  const order = () => rows().map(row => row.querySelector('[id$="-thought"]').textContent).join(",");
  const wait = async condition => {
    const end = Date.now() + 5000;
    while (!condition()) {
      if (Date.now() > end) throw new Error("카드 복원 대기 시간 초과");
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  await wait(() => rows().length === 2);
  const original = order();
  rows()[0].querySelector('[aria-label="덱에서 카드 제거"]').click();
  await wait(() => rows().length === 1);
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true }));
  await wait(() => rows().length === 2);
  if (order() !== original) throw new Error("삭제 취소는 카드 순서도 복원해야 한다");
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "y", ctrlKey: true, bubbles: true }));
  await wait(() => rows().length === 1);
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true }));
  await wait(() => rows().length === 2);
  if (!document.querySelector('[aria-label="덱 저장"]').disabled) throw new Error("원래 상태로 복원하면 변경 없음이어야 한다");
  return "PASS: 카드 삭제, 실행 취소 시 순서 복원, 다시 실행, 변경 없음 복귀";
}

// Start on a published /decks/1, so the editor has a real same-document back entry.
export async function checkBack() {
  const wait = async condition => {
    const end = Date.now() + 5000;
    while (!condition()) {
      if (Date.now() > end) throw new Error("뒤로 가기 검증 대기 시간 초과");
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  const edit = () => [...document.querySelectorAll("button")].find(button => button.textContent === "편집하기");
  await wait(edit);
  edit().click();
  await wait(() => document.querySelector('[aria-label="덱에서 카드 제거"]'));
  document.querySelector('[aria-label="덱에서 카드 제거"]').click();
  await wait(() => document.querySelectorAll('article[aria-label^="카드 "]').length === 1);
  const original = window.confirm;
  let calls = 0;
  window.confirm = () => { calls++; return false; };
  try {
    history.back();
    await wait(() => calls === 1);
    if (!location.pathname.endsWith("/edit")) throw new Error("뒤로 가기 취소 시 편집기를 유지해야 한다");
    window.confirm = () => true;
    history.back();
    await wait(() => location.pathname === "/decks/1");
  } finally { window.confirm = original; }
  return "PASS: 브라우저 뒤로 가기 취소와 승인 (Navigation API 지원 브라우저)";
}

export async function checkPublish() {
  const wait = async condition => {
    const end = Date.now() + 7000;
    while (!condition()) {
      if (Date.now() > end) throw new Error("발행 검증 대기 시간 초과");
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  const button = text => [...document.querySelectorAll("button")].find(el => el.textContent.trim() === text);
  await wait(() => document.querySelector('[aria-label="아래로 이동"]'));
  document.querySelector('[aria-label="아래로 이동"]').click();
  await wait(() => !document.querySelector('[aria-label="덱 저장"]').disabled);
  const state = window.saveCheck;
  state.hold = true;
  button("발행하기").click();
  await wait(() => state.pending.length === 1);
  if (state.writes[0].path !== "/decks/1/graph") throw new Error("발행 전 카드 순서를 저장해야 한다");
  state.release();
  await wait(() => state.pending.length === 1 && state.writes.length === 2);
  if (!button("발행 중...").disabled || !document.querySelector('[aria-busy="true"][inert]')) throw new Error("발행 중 중복 클릭과 편집을 막아야 한다");
  state.fail = true;
  state.release();
  await wait(() => button("발행하기") && !button("발행하기").disabled);
  if (!location.pathname.endsWith("/edit")) throw new Error("발행 실패 시 편집기를 유지해야 한다");
  state.fail = false;
  button("발행하기").click();
  await wait(() => state.pending.length === 1);
  state.release();
  await wait(() => location.pathname === "/decks/1");
  if (state.writes.length !== 3 || state.deck.status !== "published") throw new Error("재시도는 저장된 덱을 중복 생성하면 안 된다");
  if (state.deck.nodes.find(node => node.cardId === 2).order !== 0) throw new Error("변경한 카드 순서를 저장해야 한다");
  if (state.deck.connections.length !== 1 || state.deck.nodes.find(node => node.cardId === 1).positionX !== 100) throw new Error("발행해도 연결과 위치를 보존해야 한다");
  if (state.unexpected.length) throw new Error(state.unexpected.join(", "));
  return "PASS: 그래프 저장 후 발행, 발행 중 잠금, 실패 후 재발행, 카드 순서와 위치·연결 보존";
}

export async function checkCreateSave() {
  const wait = async condition => {
    const end = Date.now() + 5000;
    while (!condition()) {
      if (Date.now() > end) throw new Error("새 덱 저장 후 편집 URL로 이동해야 한다");
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  const save = () => document.querySelector('[aria-label="덱 저장"]');
  await wait(() => save() && !save().disabled);
  window.saveCheck.hold = true;
  save().click();
  save().click();
  await wait(() => window.saveCheck.pending.length === 1);
  if (window.saveCheck.writes.length !== 1) throw new Error("새 덱 중복 생성 금지");
  window.saveCheck.release();
  await wait(() => location.pathname === "/decks/1/edit");
  await wait(() => document.querySelector("header h1")?.textContent === "My Reading Flow");
  return "PASS: 새 덱 단일 생성, 저장한 덱의 편집 URL로 전환";
}

export async function checkNewPublishFailure() {
  const wait = async condition => {
    const end = Date.now() + 7000;
    while (!condition()) {
      if (Date.now() > end) throw new Error("새 덱 발행 실패 검증 대기 시간 초과");
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  const button = text => [...document.querySelectorAll("button")].find(el => el.textContent.trim() === text);
  await wait(() => document.querySelector("aside article"));
  document.querySelector("aside article").click();
  await wait(() => document.querySelector("aside article")?.textContent.includes("좋은 생각"));
  document.querySelector("aside article").click();
  await wait(() => !button("발행하기").disabled);
  const state = window.saveCheck;
  state.hold = true;
  button("발행하기").click();
  await wait(() => state.pending.length === 1);
  state.release();
  await wait(() => state.pending.length === 1 && state.writes.length === 2);
  state.fail = true;
  state.release();
  await wait(() => location.pathname === "/decks/1/edit");
  await wait(() => document.querySelector('article [id$="-thought"]'));
  if (state.deck.status !== "draft" || state.deck.nodes.length !== 1) throw new Error("발행 실패 후 저장된 초안을 보존해야 한다");
  return "PASS: 새 덱 발행 실패 후 저장된 초안 편집 URL과 카드 보존";
}
