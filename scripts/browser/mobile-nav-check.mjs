// Run on a public page while signed out, at 320px and 390px wide.
export function check() {
  const header = document.querySelector("header");
  const controls = [...header.querySelectorAll("a,button")]
    .filter(element => element.getBoundingClientRect().width > 0);
  for (let i = 0; i < controls.length; i++) {
    const a = controls[i].getBoundingClientRect();
    if (a.left < 0 || a.right > innerWidth) throw new Error("Header control outside viewport");
    for (const next of controls.slice(i + 1)) {
      const b = next.getBoundingClientRect();
      if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
        throw new Error(`Overlapping header controls: ${controls[i].textContent} / ${next.textContent}`);
      }
    }
  }
  if (document.documentElement.scrollWidth > innerWidth) throw new Error("Horizontal overflow");
  const theme = header.querySelector('button[aria-label$="모드로 전환"]');
  if (!theme) throw new Error("Theme button must have an accessible name");
  const nav = document.querySelector('[aria-label="모바일 내비게이션"]');
  if (location.pathname === "/") {
    if (nav) throw new Error("Landing must not show app bottom navigation");
    return "PASS: landing header, no app bottom navigation";
  }
  if (!nav) throw new Error("Missing mobile bottom navigation");
  const links = [...nav.querySelectorAll("a")];
  if (links.map(link => link.getAttribute("href")).join() !== "/books,/books/library,/decks,/community") {
    throw new Error("Unexpected bottom navigation destinations");
  }
  if (innerWidth >= 768) {
    if (nav.getBoundingClientRect().height) throw new Error("Mobile navigation visible on desktop");
    return "PASS: desktop header, mobile navigation hidden";
  }
  const bounds = nav.getBoundingClientRect();
  if (Math.abs(bounds.bottom - innerHeight) > 1) throw new Error("Navigation must stay at viewport bottom");
  for (const link of links) {
    const rect = link.getBoundingClientRect();
    if (rect.height < 44 || rect.width < 44) throw new Error("Small navigation touch target");
    const href = link.getAttribute("href");
    const expected = href === "/books"
      ? location.pathname === href || location.pathname.startsWith("/cards/")
      : href === "/books/library"
        ? location.pathname.startsWith("/books/")
        : location.pathname === href || location.pathname.startsWith(href + "/");
    if ((link.getAttribute("aria-current") === "page") !== expected) throw new Error("Incorrect active link");
  }
  if (parseFloat(getComputedStyle(document.body).paddingBottom) < bounds.height) throw new Error("Missing bottom clearance");
  const widget = document.querySelector('[aria-label="피드백 위젯 열기"]');
  if (widget && widget.getBoundingClientRect().bottom > bounds.top) throw new Error("Chat overlaps bottom navigation");
  return "PASS: header, four navigation links, active state, touch targets and chat clearance";
}

// Run on /books after installing modal-viewport-check.mock with home-summary data.
export function checkBookActions() {
  const add = [...document.querySelectorAll('button[aria-label="새 책 추가"]')]
    .find(element => getComputedStyle(element.parentElement).position === "fixed");
  const widget = document.querySelector('[aria-label="피드백 위젯 열기"]');
  if (!add) throw new Error("Floating book button needs an accessible name");
  const a = add.getBoundingClientRect();
  const b = widget.getBoundingClientRect();
  const nav = document.querySelector('[aria-label="모바일 내비게이션"]').getBoundingClientRect();
  if (a.bottom > nav.top || b.bottom > nav.top) throw new Error("Floating actions overlap bottom navigation");
  if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
    throw new Error("Book and widget buttons overlap");
  }
  return "PASS: named book action, no overlap with widget";
}
