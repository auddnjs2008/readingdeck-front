# Create Book Modal Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make book search the default modal entry point and align search, selection, manual entry, and upload surfaces with ReadingDeck's editorial design.

**Architecture:** Preserve `CreateBookModal` as the owner of the creation draft and mutation. Remove the redundant entry step, keep `CoverSearch` responsible for remote search state, and restyle the shared image uploader without changing its file contract.

**Tech Stack:** React 19, Next.js, TypeScript, Tailwind CSS, TanStack Query, Radix Dialog

---

### Task 1: Make search the default creation flow

**Files:**
- Modify: `src/entities/book/ui/create-book-modal/index.tsx`

- [ ] **Step 1: Verify the baseline**

Run:

```bash
pnpm exec eslint src/entities/book/ui/create-book-modal/index.tsx
pnpm typecheck
```

Expected: TypeScript passes; ESLint reports only the existing unused `clearSelection` warning.

- [ ] **Step 2: Remove the entry step**

Change `Step` to `"search" | "manual"`, initialize and reset it to `"search"`, delete the unused `clearSelection`, and remove the two large search/manual choice cards. Keep `enterManualStep`, `handleSearchSelect`, and `handleCreateBook` behavior.

- [ ] **Step 3: Flatten the modal structure**

- Use an editorial header with `책 추가` and a short search-first description.
- Add a small `직접 입력` command beside the search section rather than a large option card.
- Render selected search data as a flat summary separated by rules.
- Keep the search result selection as the condition that enables `서재에 추가`.
- Remove the `Esc` keyboard hint and retain only cancel and submit actions.
- Reset all form and selection state when the modal closes.

- [ ] **Step 4: Flatten manual inputs**

Keep the same controlled values and upload behavior. Add explicit `htmlFor`/`id` connections, use Korean field labels, and replace rounded filled inputs with transparent inputs and restrained borders. Preserve title validation, selected cover preview, cover change, and object URL cleanup.

- [ ] **Step 5: Run targeted verification**

Run:

```bash
pnpm exec eslint src/entities/book/ui/create-book-modal/index.tsx
pnpm typecheck
git diff --check
```

Expected: all commands exit successfully with no warning in the changed modal file.

### Task 2: Restyle search results and upload surface

**Files:**
- Modify: `src/entities/book/ui/create-book-modal/cover-search.tsx`
- Modify: `src/shared/ui/image-upload.tsx`

- [ ] **Step 1: Convert search results to informative rows**

Keep debounce, query, pagination, selection, empty, loading, and retry logic. Replace the cover-only 3-column grid with a vertical list that displays cover, title, first author, and publisher. Use a border or selected marker instead of rings, badges, and hover scale.

- [ ] **Step 2: Flatten search states and pagination**

Use a labeled search input with a search icon, compact previous/next controls, and flat loading/idle/empty/error surfaces. Preserve result counts and page state.

- [ ] **Step 3: Simplify the uploader**

Keep the native file input, `accept="image/*"`, selected filename, and callback. Replace the large rounded dashed card and English copy with a compact bordered upload row and Korean copy.

- [ ] **Step 4: Run full verification**

Run:

```bash
pnpm lint
pnpm typecheck
git diff --check
pnpm build
```

Expected: lint has no new errors or warnings, TypeScript and diff checks pass, and the production build completes.

Manually verify desktop and mobile widths for search, selection, pagination, empty/error states, manual entry, upload preview/change, close reset, duplicate-submit prevention, and success navigation.

- [ ] **Step 5: Commit**

```bash
git add src/entities/book/ui/create-book-modal/index.tsx src/entities/book/ui/create-book-modal/cover-search.tsx src/shared/ui/image-upload.tsx
git commit -m "style(books): simplify create modal"
```

