// Install mock as an init script on /support. All XHR is local to the browser.
export function mock() {
  window.widgetCheck = { requests: [], fail: false };
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this.widgetPath = new URL(url, location.href).pathname;
    this.widgetMethod = method;
    return open.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function (body) {
    let data = { id: 1, name: "Preview", profile: null };
    const failure = window.widgetCheck.fail && this.widgetMethod === "POST";
    if (this.widgetMethod === "POST") window.widgetCheck.requests.push({ path: this.widgetPath, body: JSON.parse(body) });
    if (this.widgetPath === "/feedback") data = { ok: true };
    if (this.widgetPath === "/ai/chat") data = { threadId: "test-thread", answer: "기록에서 찾은 **작은 실천**입니다.", sources: [{ cardId: 1, type: "action", thought: "매일 한 문장 기록하기", bookTitle: "테스트 책", author: "작가", pageStart: 10, pageEnd: null }] };
    setTimeout(() => {
      Object.defineProperties(this, { status: { value: failure ? 500 : 200 }, statusText: { value: failure ? "Error" : "OK" }, readyState: { value: 4 }, responseText: { value: JSON.stringify(data) }, response: { value: JSON.stringify(data) } });
      for (const event of ["readystatechange", "load", "loadend"]) this.dispatchEvent(new Event(event));
    }, 250);
  };
}

export async function check() {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const wait = async condition => {
    const end = Date.now() + 5000;
    while (!condition()) {
      assert(Date.now() < end, "Timed out waiting for widget");
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  const trigger = document.querySelector('[aria-label="피드백 위젯 열기"]');
  document.querySelector('[aria-label="Close tanstack query devtools"]')?.click();
  trigger.click();
  await wait(() => document.querySelector("textarea"));
  await new Promise(resolve => setTimeout(resolve, 300));
  const panel = document.querySelector("textarea").closest('[role="dialog"]') || document.querySelector("textarea").parentElement.parentElement.parentElement;
  const rect = panel.getBoundingClientRect();
  assert(rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight, "Widget must fit the viewport");
  const button = text => [...panel.querySelectorAll("button")].find(el => el.textContent.trim() === text);
  const fill = value => {
    const field = panel.querySelector("textarea");
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(field, value);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  };
  fill("  화면이 깔끔해졌어요  ");
  await wait(() => !panel.querySelector('[aria-label="전송"]').disabled);
  panel.querySelector("textarea").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", isComposing: true, bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 50));
  assert(window.widgetCheck.requests.length === 0, "IME composition must not submit");
  panel.querySelector('[aria-label="전송"]').click();
  await wait(() => panel.textContent.includes("서비스 개선에 참고"));
  assert(window.widgetCheck.requests[0].body.message === "화면이 깔끔해졌어요", "Feedback payload changed");
  button("AI 대화").click();
  await wait(() => !panel.querySelector("textarea").disabled);
  fill("실천에 대한 기록을 찾아줘");
  await wait(() => !panel.querySelector('[aria-label="전송"]').disabled);
  panel.querySelector('[aria-label="전송"]').click();
  await wait(() => panel.textContent.includes("근거 카드 1개 보기"));
  button("근거 카드 1개 보기").click();
  await wait(() => panel.textContent.includes("매일 한 문장 기록하기"));
  assert(panel.scrollWidth <= panel.clientWidth + 1, "Answer or sources overflow");
  panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await wait(() => !document.querySelector('[role="dialog"]'));
  await wait(() => document.activeElement === trigger);
  assert(window.widgetCheck.requests.length === 2, "Unexpected or duplicate submission");
  return "PASS: viewport, feedback, AI, source cards, Escape, focus restoration";
}
