// Install community-share-check.mock(deckFixture with cardId on nodes),
// then open /decks/1/edit at a mobile viewport. No live writes are needed.
export async function check() {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const wait = async (condition) => {
    const deadline = Date.now() + 5000;
    while (!condition()) {
      assert(Date.now() < deadline, "Timed out waiting for mobile graph");
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };
  await wait(() => document.querySelectorAll('svg g[role="button"]').length === 2);
  const nodes = [...document.querySelectorAll('svg g[role="button"]')];
  nodes[1].focus();
  nodes[1].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  await wait(() => nodes[1].getAttribute("aria-pressed") === "true");
  const selected = [...document.querySelectorAll("section")].find((el) => el.querySelector("h2")?.textContent === "선택한 카드");
  assert(selected.textContent.includes("오늘부터 하루에"), "Selected thought must change");
  nodes[0].dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
  await wait(() => nodes[0].getAttribute("aria-pressed") === "true");
  assert(selected.textContent.includes("좋은 생각"), "Space must select a node");
  const toggle = [...document.querySelectorAll("button")].find((el) => el.textContent === "카드 2개 보기");
  toggle.click();
  await wait(() => toggle.getAttribute("aria-expanded") === "true");
  assert(toggle.closest("section").querySelectorAll("button").length === 3, "All cards must be visible");
  toggle.click();
  await wait(() => toggle.getAttribute("aria-expanded") === "false");
  assert(document.documentElement.scrollWidth <= innerWidth, "No horizontal overflow");
  return "PASS: Enter/Space selection, selected thought, disclosure, responsive width";
}
