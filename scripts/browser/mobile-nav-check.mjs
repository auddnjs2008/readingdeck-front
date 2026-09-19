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
  return "PASS: header controls fit without overlap";
}

// Run on /books after installing modal-viewport-check.mock with home-summary data.
export function checkBookActions() {
  const add = [...document.querySelectorAll('button[aria-label="새 책 추가"]')]
    .find(element => getComputedStyle(element.parentElement).position === "fixed");
  const widget = document.querySelector('[aria-label="피드백 위젯 열기"]');
  if (!add) throw new Error("Floating book button needs an accessible name");
  const a = add.getBoundingClientRect();
  const b = widget.getBoundingClientRect();
  if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
    throw new Error("Book and widget buttons overlap");
  }
  return "PASS: named book action, no overlap with widget";
}
