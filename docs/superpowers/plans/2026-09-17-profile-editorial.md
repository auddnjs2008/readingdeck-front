# Editorial Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the profile route into a flat editorial summary of the user's identity, reading totals, and account links without changing account behavior.

**Architecture:** Keep the existing profile and library-stat queries plus their error handling. Restyle the current page, edit dialog, and account support component in place; no new component layer or API work is needed.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS, TanStack Query, existing ReadingDeck UI primitives

---

### Task 1: Flatten the profile page

**Files:**
- Modify: `src/app/(afterLogin)/(main)/profile/page.tsx`
- Modify: `src/app/(afterLogin)/(main)/profile/page-client.tsx`

- [ ] **Step 1: Verify baseline**

Run ESLint for both profile route files and `pnpm typecheck`; expect success.

- [ ] **Step 2: Align route metadata**

Change the child route title from `Profile | ReadingDeck` to `프로필` so the root metadata template adds the brand once.

- [ ] **Step 3: Replace cards with one editorial flow**

Build the approved `MY PROFILE` / `나의 기록` heading, a compact identity row, two divided record totals, and the existing account section. Remove the decorative statistic icons, rounded cards, large avatar, and shadows. Keep query success, pending, error, and retry behavior unchanged.

- [ ] **Step 4: Match the loading skeleton**

Use the same flat page structure for loading: heading blocks, identity row, divided totals, and account rows. Avoid rounded container cards.

### Task 2: Align profile and account dialogs

**Files:**
- Modify: `src/entities/me/ui/profile-edit-dialog/index.tsx`
- Modify: `src/features/me/delete-account/ui/index.tsx`

- [ ] **Step 1: Flatten the profile edit dialog**

Keep draft, preview URL cleanup, file selection, validation, submit, toast, and reset behavior unchanged. Reduce the dialog radius and remove avatar shadows and capsule styling while preserving labels and keyboard behavior.

- [ ] **Step 2: Turn account support into rows**

Render support, privacy, and terms as full-width link rows, followed by a destructive member-deletion button row. Remove repeated explanatory copy from the page and retain the full warning in the confirmation dialog.

- [ ] **Step 3: Flatten the deletion confirmation**

Match the profile dialog radius and spacing. Preserve the mutation, pending state, toasts, and redirect to `/login`.

- [ ] **Step 4: Verify and commit**

Run:

```bash
pnpm exec eslint 'src/app/(afterLogin)/(main)/profile/page.tsx' 'src/app/(afterLogin)/(main)/profile/page-client.tsx' src/entities/me/ui/profile-edit-dialog/index.tsx src/features/me/delete-account/ui/index.tsx
pnpm typecheck
git diff --check
pnpm lint
pnpm build
```

Expected: no ESLint errors, TypeScript and the production build succeed, and existing repository warnings remain unchanged. Commit as `style(profile): simplify account overview`.
