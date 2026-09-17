# Deck Create Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the shared deck editor so `/decks/create` has a calm editorial hierarchy without changing deck behavior.

**Architecture:** Reuse the existing shared editor and state. Limit changes to Tailwind classes, labels, and presentational markup in the editor navigation, draft overview, empty state, and metadata dialog.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, lucide-react

---

### Task 1: Flatten the editor navigation

**Files:**
- Modify: `src/widgets/deck-editor/ui/deck-editor-nav.tsx`

- [ ] Replace shadows and oversized rounded controls with the existing flat editorial borders and spacing.
- [ ] Translate visible editor utility labels while preserving accessible icon labels and all handlers.
- [ ] Run `pnpm exec eslint src/widgets/deck-editor/ui/deck-editor-nav.tsx` and expect exit code 0.

### Task 2: Clarify the draft and empty states

**Files:**
- Modify: `src/widgets/deck-editor/deck-card-deck-mode.tsx`
- Modify: `src/widgets/deck-editor/deck-create-client.tsx`

- [ ] Convert the draft summary from a floating card to an unframed introductory section.
- [ ] Reduce the builder heading and empty-state chrome while retaining checklist, reorder, selection, and removal behavior.
- [ ] Translate the list/graph mode labels without changing mode state.
- [ ] Run ESLint for both files and expect exit code 0.

### Task 3: Align the deck metadata dialog

**Files:**
- Modify: `src/widgets/deck-editor/deck-meta-panel.tsx`

- [ ] Apply the compact modal radius, flat input styling, and explicit apply button used by the current design language.
- [ ] Preserve non-empty title validation and the existing `onApply` contract.
- [ ] Run `pnpm exec eslint src/widgets/deck-editor/deck-meta-panel.tsx` and expect exit code 0.

### Task 4: Verify and integrate

**Files:**
- Verify only

- [ ] Run targeted ESLint for all four changed files and expect exit code 0.
- [ ] Run `pnpm typecheck` and expect exit code 0.
- [ ] Run `npm run build` and expect exit code 0.
- [ ] Commit the implementation and fast-forward it into `dev`.
