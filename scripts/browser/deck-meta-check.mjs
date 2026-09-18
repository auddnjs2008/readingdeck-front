// Install community-share-check mock with deck-list-editor-check fixture,
// navigate to /decks/1/edit, then evaluate check(). XHR is mocked.
export async function check() {
  if (!window.shareCheck) throw new Error("Install mock before navigation");
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const wait = async (condition) => {
    const deadline = Date.now() + 5000;
    while (!condition()) {
      assert(Date.now() < deadline, "Timed out waiting for modal");
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };
  const dialog = () => document.querySelector('[role="dialog"]');
  const button = (text) => [...dialog().querySelectorAll("button")].find((el) => el.textContent === text);
  const change = (el, value) => {
    const proto = el.tagName === "INPUT" ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  await wait(() => document.querySelector('[aria-label="덱 정보 편집"]'));
  const trigger = document.querySelector('[aria-label="덱 정보 편집"]');
  const open = async () => { trigger.focus(); trigger.click(); await wait(dialog); };
  const original = document.querySelector("h1").textContent;
  await open();
  assert(dialog().querySelector("input").maxLength === 255, "Title limit");
  assert(dialog().querySelector("textarea").maxLength === 500, "Description limit");
  change(dialog().querySelector("input"), "Discarded title");
  change(dialog().querySelector("textarea"), "Discarded description");
  button("취소").click();
  await wait(() => !dialog());
  await wait(() => document.activeElement === trigger);
  assert(document.querySelector("h1").textContent === original, "Cancel must not apply");
  await open();
  assert(dialog().querySelector("input").value === original, "Draft resets on reopen");
  assert(dialog().querySelector("textarea").value !== "Discarded description", "Description resets");
  change(dialog().querySelector("input"), "   ");
  dialog().querySelector("form").requestSubmit();
  await wait(() => dialog().querySelector('[aria-invalid="true"]'));
  assert(dialog().querySelector('[role="alert"]'), "Inline error missing");
  assert(document.activeElement === dialog().querySelector("input"), "Focus invalid title");
  document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await wait(() => !dialog());
  assert(document.querySelector("h1").textContent === original, "Escape must not apply");
  await open();
  change(dialog().querySelector("input"), "  Updated title  ");
  change(dialog().querySelector("textarea"), "Updated description");
  dialog().querySelector("form").requestSubmit();
  await wait(() => !dialog());
  assert(document.querySelector("h1").textContent === "Updated title", "Apply trims and updates title");
  await open();
  assert(dialog().querySelector("textarea").value === "Updated description", "Apply updates description");
  change(dialog().querySelector("input"), "Discard via close");
  dialog().querySelector('[aria-label="닫기"]').click();
  await wait(() => !dialog());
  assert(document.querySelector("h1").textContent === "Updated title", "Close must discard");
  return "PASS: cancel, reset, focus, limits, inline validation, Escape, apply, close";
}
