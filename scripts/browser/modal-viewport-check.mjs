// Use mock as the init script. Run check on /profile, /books/library or /books/1
// at 390x400 and 390x844. Viewport resizing does not emulate an actual OS keyboard.
export function mock() {
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this.mockPath = new URL(url, location.href).pathname;
    return open.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function () {
    let data = {};
    if (this.mockPath === "/me") data = { id: 1, name: "테스트", email: "preview@example.com", profile: null };
    if (this.mockPath === "/me/library-stats") data = { bookCount: 0, cardCount: 0 };
    if (this.mockPath === "/books/1") data = { id: 1, title: "테스트 책", author: "작가", status: "reading", progressPercent: 0, cardCount: 0 };
    if (this.mockPath === "/books" || this.mockPath.includes("cards")) data = { items: [], meta: { total: 0, page: 1, take: 12, totalPages: 0 }, nextCursor: null };
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
  const wait = async (condition) => {
    const end = Date.now() + 5000;
    while (!condition()) {
      assert(Date.now() < end, "Timed out waiting for modal");
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };
  const profile = location.pathname === "/profile";
  const library = location.pathname.endsWith("library");
  const label = profile ? "프로필 수정" : library ? "새 책 추가" : "카드 추가";
  const button = (text, root = document) => [...root.querySelectorAll("button")].find((el) => el.textContent.trim().endsWith(text));
  await wait(() => button(label));
  document.querySelector('[aria-label="Close tanstack query devtools"]')?.click();
  button(label).click();
  await wait(() => document.querySelector('[role="dialog"]'));
  const dialog = document.querySelector('[role="dialog"]');
  if (library) { button("직접 입력", dialog).click(); await wait(() => dialog.querySelector("textarea")); }
  await new Promise((resolve) => setTimeout(resolve, 300));
  const rect = dialog.getBoundingClientRect();
  assert(rect.top >= 0 && rect.bottom <= innerHeight + 1, `Dialog outside viewport: ${rect.top}..${rect.bottom}/${innerHeight}`);
  assert(dialog.scrollWidth <= dialog.clientWidth + 1, "Dialog has horizontal overflow");
  const field = profile ? dialog.querySelector("#profile-name") : [...dialog.querySelectorAll("textarea")].at(-1);
  field.focus();
  field.scrollIntoView({ block: "center" });
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert(field.getBoundingClientRect().bottom > rect.top && field.getBoundingClientRect().top < rect.bottom, "Input must be reachable");
  const save = button(profile ? "프로필 저장" : library ? "서재에 추가" : "카드 저장", dialog);
  save.scrollIntoView({ block: "center" });
  await new Promise((resolve) => setTimeout(resolve, 100));
  const saveRect = save.getBoundingClientRect();
  assert(saveRect.top >= 0 && saveRect.bottom <= innerHeight, "Save must be reachable");
  assert(save.disabled, "Empty or unchanged draft must not submit");
  return `PASS: ${label}, ${innerWidth}x${innerHeight}, dialog bounds, scroll, input, save`;
}
