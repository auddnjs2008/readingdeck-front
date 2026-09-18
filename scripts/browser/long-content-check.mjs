// Install mock.toString() as an init script, then run check() on the listed routes.
// No live API requests or writes are sent.
export function mock() {
  const title = "VeryLongBookTitleWithoutSpaces".repeat(6);
  const book = { id: 1, title, author: "LongAuthorName".repeat(10), publisher: "Publisher".repeat(10), backgroundImage: null, status: "reading", cardCount: 1, progressPercent: 0 };
  const card = { id: 1, type: "insight", title, thought: ("길게 적은 생각입니다.\n" + "https://example.com/" + "long-path".repeat(25) + "\n").repeat(8), quote: "인용한 문장입니다.\n" + "UnbrokenQuotation".repeat(30), pageStart: 1, pageEnd: 10, book, createdAt: "2026-09-19", revisitCount: 0 };
  const deck = { id: 1, name: title, description: card.thought, mode: "graph", status: "published", isShared: false, nodes: [1, 2].map(id => ({ id, cardId: id, type: "card", card: { ...card, id }, book, order: id, positionX: id * 100, positionY: id * 100 })), connections: [{ id: 1, fromNodeId: 1, toNodeId: 2 }] };
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this.fixturePath = new URL(url, location.href).pathname;
    return open.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function () {
    const responses = {
      "/me": { id: 1, name: "Preview", email: "preview@example.com", profile: null },
      "/me/library-stats": { bookCount: 1, cardCount: 1 },
      "/books": { items: [book], meta: { total: 1, page: 1, take: 12, totalPages: 1 } },
      "/books/1": book,
      "/books/1/cards": { items: [card], nextCursor: null, hasNext: false },
      "/cards/1": card,
      "/decks/1": deck,
    };
    const data = responses[this.fixturePath] ?? {};
    setTimeout(() => {
      Object.defineProperties(this, {
        status: { value: 200 }, statusText: { value: "OK" }, readyState: { value: 4 },
        responseText: { value: JSON.stringify(data) }, response: { value: JSON.stringify(data) },
      });
      for (const name of ["readystatechange", "load", "loadend"]) this.dispatchEvent(new Event(name));
    }, 100);
  };
}

export async function check() {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const wait = async condition => {
    const end = Date.now() + 5000;
    while (!condition()) {
      assert(Date.now() < end, "Timed out waiting for content");
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  };
  await wait(() => document.body.textContent.includes("VeryLongBookTitle"));
  document.querySelector('[aria-label="Close tanstack query devtools"]')?.click();
  if (location.pathname === "/books/1") {
    await wait(() => document.querySelector('button[aria-controls="book-card-1-content"]'));
    const toggle = document.querySelector('button[aria-controls="book-card-1-content"]');
    toggle.click();
    await wait(() => document.getElementById("book-card-1-content"));
    const content = document.getElementById("book-card-1-content");
    assert(content.textContent.includes("long-path"), "Expanded thought missing");
    assert(content.textContent.includes("UnbrokenQuotation"), "Expanded quote missing");
    assert(content.scrollWidth <= content.clientWidth + 1, "Expanded content overflows horizontally");
    for (const element of content.querySelectorAll("p, blockquote")) {
      assert(element.scrollHeight <= element.clientHeight + 1, "Expanded text clipped vertically");
    }
  }
  if (location.pathname.startsWith("/books")) assert(document.body.textContent.includes("No Cover"), "Missing cover fallback");
  for (const element of document.querySelectorAll("h1, article p, article blockquote")) {
    if (getComputedStyle(element).textOverflow === "ellipsis") continue;
    assert(element.scrollWidth <= element.clientWidth + 1, `Text clipped or overflowing: ${element.tagName} ${element.textContent.slice(0,30)}`);
  }
  assert(document.documentElement.scrollWidth <= innerWidth, "Page overflows horizontally");
  return `PASS: ${location.pathname}, ${innerWidth}px, long text and fallback`;
}
