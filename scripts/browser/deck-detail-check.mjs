// Use community-share-check.mjs mock(deckFixture) as the browser init script.
// Navigate to /decks/1 and evaluate check(), at desktop and mobile sizes.
export const deckFixture = {
  name: "문장에서 시작된 작은 변화",
  description: "읽으며 남긴 생각들을 하나씩 연결했습니다.",
  mode: "graph",
  nodes: [1, 2].map((id) => ({
    id, type: "card", order: id, positionX: id * 100, positionY: id * 100,
    book: { title: "생각의 연금술", author: "제임스 앨런" },
    card: {
      id, type: id === 1 ? "insight" : "action", title: null,
      thought: id === 1 ? "좋은 생각은 작은 실천으로 이어질 때 비로소 내 것이 된다." : "오늘부터 하루에 한 문장을 기록하기로 했다.",
      quote: "마음에 품은 생각이 삶의 방향을 바꾼다.", pageStart: id * 10, pageEnd: null,
    },
  })),
  connections: [{ id: 1, fromNodeId: 1, toNodeId: 2 }],
};

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
  const button = (name) => [...document.querySelectorAll("button")].find((el) => el.textContent === name);
  await wait(() => document.querySelector('svg [role="button"]'));
  assert(button("그래프로 보기").getAttribute("aria-pressed") === "true", "Graph default missing");
  const node = document.querySelector('svg [aria-label="카드 2 선택"]');
  node.focus();
  node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  await wait(() => node.getAttribute("aria-pressed") === "true");
  assert(document.querySelector("main aside").textContent.includes("오늘부터 하루에"), "Selected card not shown");
  assert(document.querySelector("main aside").textContent.includes("원문 인용"), "Quote label missing");
  button("목록으로 읽기").click();
  await wait(() => document.querySelectorAll("main article").length === 2);
  assert(button("목록으로 읽기").getAttribute("aria-pressed") === "true", "List selection missing");
  const first = document.querySelector("main article");
  assert(first.textContent.indexOf("좋은 생각") < first.textContent.indexOf("원문 인용"), "Thought must precede quote");
  assert(document.documentElement.scrollWidth <= innerWidth, "Horizontal overflow");
  button("커뮤니티 공유").click();
  await wait(() => document.querySelector('[role="dialog"]'));
  assert(window.shareCheck.requests.length === 0, "Opening share must not publish");
  button("취소").click();
  await wait(() => !document.querySelector('[role="dialog"]'));
  button("그래프로 보기").click();
  await wait(() => document.querySelector('svg [role="button"]'));
  return "PASS: graph, keyboard selection, quote, list order, responsive width, share dialog";
}
