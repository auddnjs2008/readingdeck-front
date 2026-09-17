# Editorial Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the decorative login card with a quiet single-column ReadingDeck login screen while preserving both OAuth flows.

**Architecture:** Keep the existing `LoginPageClient` and its browser redirects. Change only its rendered copy and Tailwind classes; reuse the existing favicon, Button primitive, provider icons, theme tokens, and legal links.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS, existing ReadingDeck UI primitives

---

### Task 1: Simplify the login screen

**Files:**
- Modify: `src/app/login/page-client.tsx`

- [ ] **Step 1: Verify baseline**

Run `pnpm exec eslint src/app/login/page-client.tsx && pnpm typecheck` and expect success.

- [ ] **Step 2: Flatten the layout**

Replace the gradient page and bordered login card with a `bg-background` page, a compact ReadingDeck brand row, and one centered narrow content column. Use the existing `font-serif` class for the heading `읽고 남긴 생각을 이어가세요.` and keep supporting copy secondary.

- [ ] **Step 3: Preserve authentication and legal actions**

Keep `onKakaoLoginClick`, `onGoogleLoginClick`, both provider icons, and the `/terms` and `/privacy` links unchanged. Keep Kakao as the primary filled action and Google as the outlined secondary action. Remove only the non-functional `로그인에 문제가 있나요?` button and the redundant `또는` divider.

- [ ] **Step 4: Verify responsive presentation**

Confirm the content remains readable at narrow and desktop widths, buttons retain visible keyboard focus, and light and dark themes use existing color tokens.

- [ ] **Step 5: Verify and commit**

Run:

```bash
pnpm exec eslint src/app/login/page-client.tsx
pnpm typecheck
git diff --check
pnpm build
```

Expected: all checks pass. Then commit as `style(auth): simplify login page`.
