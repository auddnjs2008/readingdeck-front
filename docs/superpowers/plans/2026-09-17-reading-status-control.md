# Reading Status Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compress the expanded reading status editor into a flat two-row sidebar form without changing update behavior.

**Architecture:** Keep all state, validation, mutation, toast, collapse, and focus behavior inside the existing `BookReadingControl`. Change only its expanded JSX and styling.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, existing ReadingDeck form primitives

---

### Task 1: Restyle the expanded reading control

**Files:**
- Modify: `src/entities/book/ui/book-detail/book-detail-actions/index.tsx`

- [ ] **Step 1: Verify baseline**

Run `pnpm exec eslint src/entities/book/ui/book-detail/book-detail-actions/index.tsx && pnpm typecheck` and expect success.

- [ ] **Step 2: Compress the form**

Keep the status select as the first full-width field. Place current and total page inputs in a two-column row separated by an `aria-hidden` slash. Use square transparent controls with restrained borders and compact labels. Right-align the existing save button.

- [ ] **Step 3: Preserve behavior**

Do not change state effects, validation branches, request payload, mutation handling, toast copy, collapse behavior, focus restoration, deletion, or the confirmation dialog.

- [ ] **Step 4: Verify and commit**

Run:

```bash
pnpm exec eslint src/entities/book/ui/book-detail/book-detail-actions/index.tsx
pnpm typecheck
git diff --check
pnpm build
```

Expected: all checks pass. Then commit as `style(books): compact reading status editor`.

