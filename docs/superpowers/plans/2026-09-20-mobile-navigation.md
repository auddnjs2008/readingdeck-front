# Mobile Navigation Implementation

**Goal:** Implement the approved four-link mobile navigation without changing page contents.

**Architecture:** Keep navigation in TopNav. Share its link list between desktop
and mobile. A CSS custom property on body when mobile navigation exists supplies
safe-area-aware clearance for content, the book action, and chat; editor layouts
without TopNav inherit zero clearance. Preserve Radix modal stacking.

**Stack:** Next.js Link, Lucide React, existing theme tokens and Tailwind CSS.

## Steps

1. Extend scripts/browser/mobile-nav-check.mjs with assertions for four links,
   active state, touch targets, fixed placement and widget clearance. Run on the
   old landing page and confirm the missing navigation failure.
2. In src/widgets/top-nav/ui/index.tsx replace the mobile Sheet with a bottom nav.
   Reuse the existing destinations; add mobile labels/icons and aria-current.
   Keep desktop header and authentication controls unchanged.
3. In src/app/globals.css set --mobile-nav-offset only below 768px when the bar
   exists. Reserve bottom padding and safe area. Adjust book floating action in
   src/entities/book/ui/books-page-client.tsx and chat offsets/heights in
   src/widgets/assistant-widget/ui/index.tsx using this property.
4. Run browser checks at 320, 390 and desktop widths, including short viewport,
   themes, navigation selection, chat, overlays and editor exclusion. Use existing
   API mocks for private screens; do not write user data.
5. Run pnpm typecheck, changed-file ESLint and git diff --check. Leave uncommitted
   for user review; report actual iPhone testing limitation.
