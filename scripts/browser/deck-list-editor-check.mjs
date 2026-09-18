import { deckFixture } from "./deck-detail-check.mjs";

// Install community-share-check mock(fixture), navigate to /decks/1/edit,
// then evaluate check(). No real API requests are sent.
export const fixture = {
  ...deckFixture,
  mode: "list",
  status: "draft",
  nodes: deckFixture.nodes.map((node) => ({
    ...node,
    cardId: node.id,
    card: { ...node.card, thought: node.card.thought.repeat(10) },
  })),
};

export async function check() {
  if (!window.shareCheck) throw new Error("Install mock before navigation");
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const wait = async (condition) => {
    const deadline = Date.now() + 5000;
    while (!condition()) {
      assert(Date.now() < deadline, "Timed out waiting for editor");
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };
  const rows = () => [...document.querySelectorAll('article[aria-label^="카드 "]')];
  const tool = (row, label) => row.querySelector(`button[aria-label="${label}"]`);
  await wait(() => rows().length === 2);
  const first = rows()[0];
  const preview = first.querySelector('[aria-expanded]');
  assert(preview.getAttribute("aria-expanded") === "false", "Starts collapsed");
  const thought = preview.querySelector('span span:last-child');
  assert(thought.clientHeight <= parseFloat(getComputedStyle(thought).lineHeight) * 3 + 1, "Collapsed thought must fit three lines");
  assert(tool(first, "위로 이동").disabled, "First card cannot move up");
  assert(tool(rows()[1], "아래로 이동").disabled, "Last card cannot move down");
  preview.click();
  await wait(() => preview.getAttribute("aria-expanded") === "true");
  assert(!document.getElementById(preview.getAttribute("aria-controls")).hidden, "Quote visible when expanded");
  const text = preview.querySelector('span span:last-child');
  assert(text.scrollHeight <= text.clientHeight + 1, "Expanded thought must not be clipped");
  tool(first, "아래로 이동").click();
  await wait(() => rows()[1] === first);
  assert(preview.getAttribute("aria-expanded") === "true", "Reorder preserves expansion");
  assert(!tool(first, "위로 이동").disabled, "Moved card can move up");
  tool(first, "위로 이동").click();
  await wait(() => rows()[0] === first);
  preview.click();
  await wait(() => preview.getAttribute("aria-expanded") === "false");
  assert(document.documentElement.scrollWidth <= innerWidth, "No horizontal overflow");
  tool(first, "덱에서 카드 제거").click();
  await wait(() => rows().length === 1);
  tool(rows()[0], "덱에서 카드 제거").click();
  await wait(() => rows().length === 0);
  assert(document.body.innerText.includes("아직 담긴 카드가 없습니다."), "Empty state missing");
  return "PASS: collapse, expand, full thought, reorder, state preservation, remove, empty";
}
