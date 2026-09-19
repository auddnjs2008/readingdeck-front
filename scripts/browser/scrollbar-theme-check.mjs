// Run on a page with the theme toggle. Samples both transitions without API writes.
export async function check() {
  const root = document.documentElement;
  const initialDark = root.classList.contains("dark");
  const toggle = () => document.querySelector('button[aria-label$="모드로 전환"]').click();
  const failures = [];
  try {
    for (let i = 0; i < 2; i++) {
      const width = root.clientWidth;
      toggle();
      const expected = root.classList.contains("dark") ? "dark" : "light";
      const colors = new Set();
      const started = performance.now();
      await new Promise(resolve => {
        const sample = () => {
          const style = getComputedStyle(root);
          colors.add(style.scrollbarColor);
          if (style.colorScheme !== expected) failures.push("Native controls use the wrong theme");
          if (style.scrollbarColor.includes("rgba(0, 0, 0, 0)")) failures.push("Scrollbar track exposes animated background");
          if (style.backgroundColor === "rgba(0, 0, 0, 0)") failures.push("Viewport background is transparent");
          if (root.clientWidth !== width) failures.push("Theme changes scrollbar layout width");
          if (performance.now() - started < 350) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });
      if (colors.size !== 1) failures.push("Scrollbar colors animate during the theme switch");
    }
    if (failures.length) throw new Error([...new Set(failures)].join("; "));
    return "PASS: both themes, opaque scrollbar track, native color scheme, stable viewport width";
  } finally {
    if (root.classList.contains("dark") !== initialDark) toggle();
  }
}
