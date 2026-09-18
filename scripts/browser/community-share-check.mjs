// Browser runner: install mock.toString() as an init script before navigating to
// /decks/1, then evaluate check.toString(). All XHR stays inside the browser.
export function mock(deckOverrides = {}) {
  window.shareCheck = { requests: [], fail: true };
  const deck = {
    id: 1, name: "Share preview", description: "Do not prefill this description",
    status: "published", mode: "list", isShared: false, sharedPostId: null,
    nodes: [], connections: [], createdAt: "2026-09-18", updatedAt: "2026-09-18",
    ...deckOverrides,
  };
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this.checkMethod = method.toUpperCase();
    this.checkPath = new URL(url, location.href).pathname;
    return open.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function (body) {
    let status = 200;
    let data = {};
    if (this.checkPath === "/me") data = { id: 1, name: "Preview" };
    if (this.checkPath === "/decks/1") data = deck;
    if (this.checkMethod === "POST" && this.checkPath === "/community/posts") {
      window.shareCheck.requests.push(JSON.parse(body));
      status = window.shareCheck.fail ? 500 : 201;
      if (status === 201) {
        deck.isShared = true;
        deck.sharedPostId = 1;
        data = { id: 1 };
      }
    }
    setTimeout(() => {
      Object.defineProperties(this, {
        status: { value: status }, statusText: { value: String(status) },
        readyState: { value: 4 }, responseText: { value: JSON.stringify(data) },
        response: { value: JSON.stringify(data) },
      });
      for (const event of ["readystatechange", "load", "loadend"]) {
        this.dispatchEvent(new Event(event));
      }
    }, 100);
  };
}

export async function check() {
  if (!window.shareCheck) throw new Error("Install mock before navigation");
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const wait = async (condition) => {
    const deadline = Date.now() + 5000;
    while (!condition()) {
      assert(Date.now() < deadline, "Timed out waiting for UI");
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };
  const button = (text) => [...document.querySelectorAll("button")].find((el) => el.textContent === text);
  const dialog = () => document.querySelector('[role="dialog"]');
  const input = (value) => {
    const el = document.querySelector("textarea");
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  await wait(() => button("커뮤니티 공유"));
  const trigger = button("커뮤니티 공유");
  trigger.focus();
  trigger.click();
  await wait(dialog);
  assert(window.shareCheck.requests.length === 0, "Opening must not publish");
  assert(document.querySelector("textarea").value === "", "Caption must start empty");
  assert(document.querySelector("textarea").maxLength === 280, "Backend caption limit must match");
  input("Draft");
  button("취소").click();
  await wait(() => !dialog());
  await wait(() => document.activeElement === trigger);
  trigger.click();
  await wait(dialog);
  assert(document.querySelector("textarea").value === "", "Reopening must reset cancelled draft");
  input("  Share this thought  ");
  await wait(() => dialog().textContent.includes("22 / 280"));
  button("공유하기").click();
  await wait(() => button("공유 중..."));
  assert(button("공유 중...").disabled, "Prevent duplicate submit while pending");
  assert(button("취소").disabled, "Prevent dismissal while pending");
  await wait(() => button("공유하기") && !button("공유하기").disabled);
  assert(dialog() && document.querySelector("textarea").value === "  Share this thought  ", "Failure must preserve draft");
  assert(window.shareCheck.requests[0].caption === "Share this thought", "Send trimmed caption");
  input("   ");
  await wait(() => dialog().textContent.includes("3 / 280"));
  window.shareCheck.fail = false;
  button("공유하기").click();
  await wait(() => !dialog());
  await wait(() => button("공유 취소"));
  assert(!("caption" in window.shareCheck.requests[1]), "Blank caption must be omitted");
  return "PASS: open, cancel, focus, reset, limit, pending, failure, retry, blank caption, success";
}
