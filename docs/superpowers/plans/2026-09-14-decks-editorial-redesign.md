# Decks Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/decks`를 완성된 덱의 그래프 미리보기가 중심인 편집형 아카이브로 개편한다.

**Architecture:** 기존 쿼리 API, 필터 선택지, 라우팅은 유지하고 페이지 셸과 두 목록 컴포넌트의 마크업 및 Tailwind 클래스만 정리한다. 작성 중인 덱의 Embla 캐러셀은 네이티브 가로 스크롤로 교체하고, 저장된 덱은 `발행됨`을 기본값으로 쓰는 3열 미리보기 그리드로 단순화한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, Day.js, Lucide React

---

## File Map

- `src/app/(afterLogin)/(main)/decks/page-client.tsx`: 페이지 표면, 제목, 설명, 새 덱 만들기 행동과 섹션 간격을 담당한다.
- `src/widgets/deck-list/active-drafts/index.tsx`: 작성 중인 덱 쿼리와 `이어 쓰기` 목록 및 서재가 비었을 때의 안내를 담당한다.
- `src/widgets/deck-list/saved-decks/index.tsx`: 저장된 덱 쿼리, 검색, 필터, 정렬, 목록 상태와 완성된 덱 그리드를 담당한다.
- `src/entities/deck/ui/deck-preview-mini/index.tsx`: 목록과 그래프 미리보기의 절제된 시각 표현을 담당한다.

### Task 1: Page Shell And Primary Action

**Files:**
- Modify: `src/app/(afterLogin)/(main)/decks/page-client.tsx`

- [ ] **Step 1: Establish the editorial page surface**

Remove the dotted fixed background. Match the Books page width and surface, then put the primary action in the header:

```tsx
<div className="min-h-screen bg-[#f9f8f4] text-[#292724] transition-colors dark:bg-[#242320] dark:text-[#ebe7df]">
  <main className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
    <header className="flex flex-col gap-5 border-b border-[#d8d4cc] pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-[#4b4842]">
      <div>
        <h1 className="font-serif text-3xl font-semibold">나의 덱</h1>
        <p className="mt-2 text-sm text-[#77726b] dark:text-[#aaa49b]">
          책과 생각을 연결해 만든 독서 기록
        </p>
      </div>
      <Link href="/decks/create" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[4px] bg-primary px-4 text-sm font-semibold text-primary-foreground">
        <Plus className="size-4" />
        새 덱 만들기
      </Link>
    </header>
    <div className="space-y-14 pt-8 md:space-y-20">
      <ActiveDraftsSection />
      <SavedDecksSection />
    </div>
  </main>
</div>
```

- [ ] **Step 2: Run static checks**

Run: `pnpm typecheck && pnpm lint`

Expected: both commands exit with code 0; existing unrelated warnings may remain.

- [ ] **Step 3: Commit the page shell**

```bash
git add 'src/app/(afterLogin)/(main)/decks/page-client.tsx'
git commit -m "style(decks): establish editorial page hierarchy"
```

### Task 2: Compact Continue-Writing List

**Files:**
- Modify: `src/widgets/deck-list/active-drafts/index.tsx`

- [ ] **Step 1: Remove carousel-only code**

Remove `useCallback`, `ChevronLeft`, `ChevronRight`, `FileEdit`, `Plus`, `Button`, and `useEmblaCarousel`. Keep the current queries, `formatUpdatedAt`, `getDeckHref`, and the no-books decision.

- [ ] **Step 2: Replace the draft cards with a native scroll list**

Render the section heading and count above a horizontally scrollable grid. Use links so pointer and keyboard navigation share one path:

```tsx
<section>
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-xs font-semibold uppercase text-[#77726b] dark:text-[#aaa49b]">이어 쓰기</h2>
    <span className="text-xs text-[#77726b] dark:text-[#aaa49b]">{draftCount}개의 초안</span>
  </div>
  <div className="hide-scrollbar grid auto-cols-[minmax(240px,1fr)] grid-flow-col overflow-x-auto border-y border-[#d8d4cc] dark:border-[#4b4842] md:auto-cols-fr">
    {activeDrafts.map((deck) => (
      <Link key={deck.id} href={getDeckHref(deck)} className="min-w-0 border-r border-[#d8d4cc] px-4 py-4 first:pl-0 dark:border-[#4b4842]">
        <h3 className="truncate font-serif text-base font-semibold">{deck.name}</h3>
        <p className="mt-1 text-xs text-[#77726b] dark:text-[#aaa49b]">
          {deck.nodeCount}개 노드 · {formatUpdatedAt(deck.updatedAt)}
        </p>
      </Link>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Simplify loading and empty states**

Use three short skeleton rows with the same borders as the final list. When there are no drafts, render plain copy inside the divided area. If the library is empty, include `책 추가하러 가기` and `편집 화면만 열기`; otherwise state that no draft is in progress. Do not add a second prominent `새 덱 만들기` action.

- [ ] **Step 4: Run static checks**

Run: `pnpm typecheck && pnpm lint`

Expected: both commands exit with code 0 and no imports removed in Step 1 remain.

- [ ] **Step 5: Commit the compact draft list**

```bash
git add src/widgets/deck-list/active-drafts/index.tsx
git commit -m "style(decks): compact the draft workspace"
```

### Task 3: Saved Deck Archive And Filters

**Files:**
- Modify: `src/widgets/deck-list/saved-decks/index.tsx`

- [ ] **Step 1: Flatten the section heading and search**

Remove `FolderOpen`. Keep `Search` inside the input, but replace the rounded filled field with a bottom-border field. Use `완성된 덱` as the section title and keep the total count at the opposite edge. Initialize `savedFilter` to `"published"`, treat that value as the no-filter baseline, and reset to `"published"`; the `전체` and `작성 중` choices remain available.

```tsx
<Input
  value={keyword}
  onChange={(event) => setKeyword(event.target.value)}
  className="h-10 rounded-none border-0 border-b border-[#aaa49b] bg-transparent pl-8 shadow-none focus-visible:ring-0"
  placeholder="덱 이름으로 검색"
/>
```

- [ ] **Step 2: Turn filter chips into compact segmented controls**

Keep every filter option and state transition unchanged. Remove hash prefixes, rounded-full shapes, colored fills, and shadows. Give each group a visible text label and use a bottom border plus primary text for the active option. Keep the existing reset action and the two sort choices.

```tsx
className={`border-b px-2 py-1.5 text-xs transition-colors ${
  active
    ? "border-primary font-semibold text-primary"
    : "border-transparent text-muted-foreground hover:text-foreground"
}`}
```

- [ ] **Step 3: Make completed decks the visual focus**

Use one column on mobile, two on tablet, and three on desktop. Remove the enclosing card fill, large radius, shadow, hover lift, duplicate `열기` button, and internal footer divider. Retain the graph preview, title, description, state, sharing text, counts, and update time.

```tsx
<Link key={deck.id} href={getDeckHref(deck)} className="group block min-w-0">
  <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] border border-[#d8d4cc] bg-[#efede8] dark:border-[#4b4842] dark:bg-[#302e2a]">
    <DeckPreviewMini preview={deck.preview} />
  </div>
  <div className="pt-3">
    <div className="flex items-start justify-between gap-3">
      <h3 className="line-clamp-1 font-serif text-lg font-semibold">{deck.name}</h3>
      <span className="shrink-0 text-[10px] font-semibold text-primary">
        {deck.status === "draft" ? "작성 중" : "발행됨"}{deck.isShared ? " · 공유됨" : ""}
      </span>
    </div>
    <p className="mt-2 text-xs text-[#77726b] dark:text-[#aaa49b]">
      {deck.nodeCount}개 노드 · {deck.connectionCount}개 연결 · {formatUpdatedAt(deck.updatedAt)}
    </p>
  </div>
</Link>
```

- [ ] **Step 4: Align loading, empty, filtered-empty, and error states**

Match skeleton aspect ratios to the final grid. Keep the existing state conditions and links, but remove large rounded error surfaces and card-like empty containers. Use horizontal dividers and concise text. Ensure every branch still reaches a visible terminal state.

- [ ] **Step 5: Run static checks**

Run: `pnpm typecheck && pnpm lint`

Expected: both commands exit with code 0; the initial status request is `published`, while every existing filter option still maps to the same query parameter as before.

- [ ] **Step 6: Commit the archive**

```bash
git add src/widgets/deck-list/saved-decks/index.tsx
git commit -m "style(decks): emphasize saved deck previews"
```

### Task 4: Preview Restraint And Visual Verification

**Files:**
- Modify: `src/entities/deck/ui/deck-preview-mini/index.tsx`
- Modify only defects found during verification in the three files above.

- [ ] **Step 1: Simplify preview decoration**

Keep the current `DeckPreview` branches and normalized SVG coordinates. Remove multicolor chip classes and dotted backgrounds from list previews. Use neutral paper surfaces, 4px nodes, thin muted connectors, and primary color only for book nodes. Preserve empty preview visibility with a plain muted surface.

- [ ] **Step 2: Run production checks**

Run: `pnpm typecheck && pnpm lint && pnpm build`

Expected: all commands exit with code 0; existing unrelated lint warnings may remain.

- [ ] **Step 3: Start the local app**

Run: `pnpm dev:local`

Expected: Next.js reports a local URL and `/decks` loads without a runtime error.

- [ ] **Step 4: Verify desktop and mobile**

Check `/decks` at 1440×900 and 390×844 in light and dark mode. Confirm:

- no horizontal page overflow or overlapping text;
- drafts occupy less vertical space than saved decks;
- saved decks render in 3, 2, and 1 columns at the intended breakpoints;
- list and graph previews remain legible;
- focus indicators are visible and every deck is keyboard reachable;
- loading, empty, filtered-empty, and error states terminate visibly.

- [ ] **Step 5: Verify existing interactions**

Confirm search debounce, status filter, mode filter, sharing filter, reset, sort, draft navigation, saved-deck navigation, book-library link, editor-only link, and new-deck navigation retain their current destinations and query behavior.

- [ ] **Step 6: Commit preview adjustments**

```bash
git add src/entities/deck/ui/deck-preview-mini/index.tsx
git commit -m "style(decks): simplify deck preview decoration"
```

If verification requires fixes in the page or list files, stage those exact files in the same final commit and record the reason in the commit body.
