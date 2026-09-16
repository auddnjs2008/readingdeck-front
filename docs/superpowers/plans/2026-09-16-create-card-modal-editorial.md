# Create Card Modal Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing card creation dialog as a flat editorial writing surface without changing its data flow or behavior.

**Architecture:** Keep the existing `CreateCardModal` state, validation, mutation, and toast flows in one component. Replace only its visual metadata and form markup, using a native radio group for card type semantics and the existing shared inputs and dialog primitives.

**Tech Stack:** React 19, Next.js, TypeScript, Tailwind CSS, Radix Dialog, Lucide icons, TanStack Query

---

### Task 1: Restyle the card creation dialog

**Files:**
- Modify: `src/features/card/create-card/ui/index.tsx`

- [ ] **Step 1: Record the baseline checks**

Run:

```bash
pnpm exec eslint src/features/card/create-card/ui/index.tsx
pnpm typecheck
```

Expected: both commands exit successfully.

- [ ] **Step 2: Simplify card type metadata**

Remove the type-specific icon, color, and dot classes from `cardTypes`. Keep only the API-facing `type` values, and add a Korean display label:

```tsx
const cardTypes: Array<{ type: CardType; label: string }> = [
  { type: "Insight", label: "인사이트" },
  { type: "Change", label: "변화" },
  { type: "Action", label: "행동" },
  { type: "Question", label: "질문" },
];
```

Keep `CARD_TYPE_TO_API` and `CARD_TYPE_HELPER` unchanged so request payloads and helper text retain their current behavior.

- [ ] **Step 3: Replace the type cards with a radio group**

Render the options inside a labeled `fieldset`. Each option uses a visually hidden native radio input and a flat label surface:

```tsx
<fieldset className="space-y-3">
  <legend className="text-sm font-medium">카드 유형</legend>
  <div className="grid grid-cols-2 border border-border sm:grid-cols-4">
    {cardTypes.map(({ type, label }) => (
      <label key={type} className="relative cursor-pointer border-border ...">
        <input
          type="radio"
          name="card-type"
          value={type}
          checked={selectedType === type}
          onChange={() => setSelectedType(type)}
          className="peer sr-only"
        />
        <span>{label}</span>
        <span aria-hidden="true" className="... peer-checked:bg-primary" />
      </label>
    ))}
  </div>
  <p className="text-xs text-muted-foreground">
    {CARD_TYPE_HELPER[selectedType]}
  </p>
</fieldset>
```

Use borders and a small selected marker instead of colored type cards, shadows, or translated hover movement. Preserve keyboard radio behavior and visible focus styling.

- [ ] **Step 4: Flatten the writing fields and footer**

Keep the current controlled values and handlers. Update only labels and classes:

- Use `새 읽기 카드` and `읽으며 붙잡은 문장과 생각을 남겨보세요.` in the header.
- Render title and page inputs with square, transparent surfaces and bottom-border emphasis.
- Render the quote textarea with a left accent border and serif text.
- Render the thought textarea as the largest writing area with serif text.
- Keep `(선택)` and `(필수)` labels visible.
- Show the minimum thought length beneath the thought field.
- Remove the `Tab`, `Esc`, and `⌘ + Enter` instructions because no matching custom keyboard handlers exist.
- Keep cancel and save actions in the footer and preserve pending/disabled behavior.

Do not change `handleSave`, `getValidationError`, `restoreDraft`, the mutation callbacks, or the request payload.

- [ ] **Step 5: Verify the implementation**

Run:

```bash
pnpm exec eslint src/features/card/create-card/ui/index.tsx
pnpm typecheck
git diff --check
pnpm build
```

Expected: ESLint has no errors in the changed file, TypeScript and diff checks pass, and the production build completes.

Manually verify at desktop and mobile widths:

1. The radio group is four columns on desktop and two columns on mobile.
2. Arrow keys and pointer input can change the selected type.
3. Closing and reopening starts with an empty form.
4. A thought shorter than three characters cannot be submitted.
5. A reversed page range cannot be submitted.
6. A failed request restores the submitted values from memory.
7. A successful request closes the dialog and exposes `방금 카드 보기` in the toast.

- [ ] **Step 6: Commit**

```bash
git add src/features/card/create-card/ui/index.tsx
git commit -m "style(cards): simplify create modal"
```
