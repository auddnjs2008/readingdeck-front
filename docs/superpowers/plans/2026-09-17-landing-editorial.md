# Editorial Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic SaaS landing page with a four-section editorial ReadingDeck introduction centered on a real-looking reading record.

**Architecture:** Keep `/` as a static client-rendered landing page and retain the shared `TopNav`. Replace the current mockups and persona grids inside `HomePageClient` with local JSX examples and restrained Framer Motion entrances; do not add API requests, state, assets, components, or dependencies.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS, Framer Motion, existing ReadingDeck theme tokens

---

### Task 1: Replace the landing composition

**Files:**
- Modify: `src/app/page-client.tsx`

- [ ] **Step 1: Verify baseline**

Run `pnpm exec eslint src/app/page-client.tsx && pnpm typecheck` and expect success.

- [ ] **Step 2: Remove the generic marketing sections**

Delete the circular knowledge-map hero, three feature mockups, persona cards, fake popular decks, rounded CTA panel, and their unused `Badge`, `Card`, icon, and motion imports. Keep `TopNav`, `Link`, and the legal footer destinations.

- [ ] **Step 3: Build the full-bleed editorial hero**

Render `ReadingDeck` as the page `h1`, followed by the display line `책을 덮은 뒤, 생각을 펼치세요.` and the approved supporting sentence. Place `/login` and `/community` actions below it. Build one continuous hero scene whose reading record shows a type, page, quote, personal thought, and book citation without wrapping the scene in a decorative card.

- [ ] **Step 4: Add the record process and deck example**

Add the `문장에서 덱으로` three-step band as a flat responsive list. Add one deck section with a small node-and-edge canvas beside selected-card content and a `/community` text link. Use static examples without popularity claims or user identities.

- [ ] **Step 5: Add the final invitation and restrained footer**

Render `읽은 것을 오래 남기는 일, 한 문장에서 시작됩니다.` with a `/login` action. Preserve links to `/terms`, `/privacy`, and `mailto:auddnjs2008@gmail.com`, plus the current copyright year.

- [ ] **Step 6: Add restrained motion and responsive behavior**

Use Framer Motion only for the initial hero reveal and the one-time deck connection-line draw. Keep hover styling to text color and underline changes. Ensure desktop uses one continuous wide scene, mobile stacks content without horizontal overflow, and existing theme tokens support both color schemes.

### Task 2: Align landing metadata

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update the route description**

Keep the title `ReadingDeck` and add the description `마음에 남은 문장과 생각을 기록하고 연결하는 독서 기록.` to the page metadata.

- [ ] **Step 2: Verify and commit**

Run:

```bash
pnpm exec eslint src/app/page.tsx src/app/page-client.tsx
pnpm typecheck
git diff --check
pnpm lint
pnpm build
```

Expected: no ESLint errors, TypeScript succeeds, the production build succeeds, and the existing repository warnings remain unchanged. Then commit as `style(home): redesign editorial landing`.
