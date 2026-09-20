// Run with community-share-check.mock(deckFixture) on /decks/1 at mobile and desktop widths.
export async function check() {
  const nodes = [...document.querySelectorAll('svg [role="button"]')];
  const node = nodes.find(element => element.getBoundingClientRect().width > 0);
  if (!node) throw new Error("Missing graph node");
  node.focus();
  if (getComputedStyle(node).outlineStyle !== "none") {
    throw new Error("Native SVG outline scales with the graph");
  }
  const ring = node.querySelector('[data-focus-ring]');
  if (!ring || getComputedStyle(ring).opacity !== "1") throw new Error("Keyboard focus indicator missing");
  if (ring.getAttribute("vector-effect") !== "non-scaling-stroke") throw new Error("Focus stroke must not scale");
  node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 100));
  if (node.getAttribute("aria-pressed") !== "true") throw new Error("Keyboard selection failed");
  node.blur();
  if (getComputedStyle(ring).opacity !== "0") throw new Error("Focus indicator remains after blur");
  return "PASS: native outline removed, keyboard focus and selection preserved";
}
