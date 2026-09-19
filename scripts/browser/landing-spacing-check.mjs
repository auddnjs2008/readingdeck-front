// Run check() on the landing page at mobile widths and a tall viewport.
export async function check() {
  await document.fonts.ready;
  const hero = document.querySelector("main > section");
  const content = hero.querySelector(".grid");
  const quote = hero.querySelector("blockquote");
  const source = quote.parentElement.lastElementChild;
  const unusedHeight = hero.getBoundingClientRect().bottom - content.getBoundingClientRect().bottom;
  if (innerWidth < 1024 && unusedHeight > 2) {
    throw new Error(`Hero leaves ${Math.round(unusedHeight)}px of empty viewport height`);
  }
  if (innerWidth < 640) {
    const gap = source.getBoundingClientRect().top - quote.getBoundingClientRect().bottom;
    if (gap < 0 || gap > 32) throw new Error(`Quote/source gap is ${gap}px`);
  }
  if (document.documentElement.scrollWidth > innerWidth) throw new Error("Horizontal overflow");
  return { viewport: [innerWidth, innerHeight], heroHeight: hero.offsetHeight, unusedHeight };
}
