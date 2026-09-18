// Install mock.toString() as a browser init script, then run check.toString().
export function mock() {
  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 180;
  const context = canvas.getContext("2d");
  context.fillStyle = "#8d302e";
  context.fillRect(0, 0, 120, 180);
  context.fillStyle = "#ffffff";
  context.font = "18px serif";
  context.fillText("Reading", 20, 65);
  context.fillText("Notes", 20, 95);
  const cover = canvas.toDataURL();
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this.libraryURL = new URL(url, location.href);
    return open.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function () {
    const { pathname, searchParams } = this.libraryURL;
    let data = {};
    if (pathname === "/me") data = { id: 1, name: "Preview" };
    if (pathname === "/me/library-stats") data = { bookCount: 12, cardCount: 24 };
    if (pathname === "/books") {
      const empty = searchParams.has("keyword");
      data = {
        items: empty ? [] : Array.from({ length: 8 }, (_, i) => ({
          id: i + 1, title: ["생각의 연금술", "세네카, 오늘을 빼앗기고 있는 당신에게", "구본형의 필살기"][i % 3],
          author: "작가", cardCount: i, status: searchParams.get("status") || "reading",
          backgroundImage: i % 3 === 0 ? cover : null,
        })),
        meta: { total: empty ? 0 : 16, page: Number(searchParams.get("page") || 1), take: 12, totalPages: empty ? 0 : 2 },
      };
    }
    setTimeout(() => {
      Object.defineProperties(this, {
        status: { value: 200 }, statusText: { value: "OK" }, readyState: { value: 4 },
        responseText: { value: JSON.stringify(data) }, response: { value: JSON.stringify(data) },
      });
      for (const name of ["readystatechange", "load", "loadend"]) this.dispatchEvent(new Event(name));
    }, 400);
  };
}

export async function check() {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const wait = async (condition) => {
    const end = Date.now() + 10000;
    while (!condition()) {
      assert(Date.now() < end, "Timed out");
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };
  const input = () => document.querySelector('input[type="search"]');
  await wait(() => document.querySelectorAll("article").length === 8);
  document.querySelector('[aria-label="Close tanstack query devtools"]')?.click();
  const search = input();
  const status = [...document.querySelectorAll('[aria-label="독서 상태"] button')].find((el) => el.textContent === "완독");
  status.click();
  await wait(() => document.querySelector('[aria-busy="true"]'));
  assert(input() === search && status.isConnected, "Filters must remain mounted during loading");
  await wait(() => document.querySelectorAll("article").length === 8);
  assert(new URLSearchParams(location.search).get("status") === "finished", "Status URL");
  assert(status.getAttribute("aria-pressed") === "true", "Selected status");
  const next = document.querySelector('a[href*="page=2"]');
  assert(next && next.href.includes("status=finished"), "Pagination preserves filters");
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(search, "  없는 책  ");
  search.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 50));
  document.querySelector('[role="search"]').requestSubmit();
  await wait(() => document.body.textContent.includes("전체 보기"));
  assert(new URLSearchParams(location.search).get("keyword") === "없는 책", "Trim search");
  assert(new URLSearchParams(location.search).get("page") === "1", "Search resets page");
  assert(document.documentElement.scrollWidth <= innerWidth, "No horizontal overflow");
  return "PASS: status, stable controls while loading, pagination, search, empty state, viewport";
}
