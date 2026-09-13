# Books Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Books 메인을 ReadingDeck의 따뜻함은 유지하면서 평평하고 절제된 편집 디자인으로 개편한다.

**Architecture:** 데이터 요청과 화면 조합은 유지하고, 현재 Books 전용인 카드와 섹션 컴포넌트의 마크업 및 Tailwind 클래스만 단순화한다. 공통 레이아웃에서는 한글 세리프 글꼴만 바로잡고, 새 표면 색과 간격은 Books 페이지 루트에 국한해 다른 화면의 시각 회귀를 막는다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, next/font, Embla Carousel, Lucide React

---

## File Map

- `src/app/layout.tsx`: `Lora`를 한글을 지원하는 `Noto Serif KR`로 교체한다.
- `src/entities/book/ui/books-page-client.tsx`: Books 전용 라이트·다크 표면, 페이지 폭, 상단 서재 링크와 모바일 추가 버튼을 정리한다.
- `src/entities/book/ui/books-page-content.tsx`: 섹션 간 수직 리듬과 로딩 스켈레톤을 새 레이아웃에 맞춘다.
- `src/entities/book/ui/large-book-card/index.tsx`: 책 표지와 메타데이터만 남기는 평평한 항목으로 단순화한다.
- `src/entities/book/ui/empty-book-state/index.tsx`: 큰 점선 카드와 장식 아이콘을 제거한다.
- `src/entities/book/ui/sections/current-reading/index.tsx`: 제목과 책 그리드 사이에 구분선을 둔다.
- `src/entities/book/ui/sections/jump-back-in/index.tsx`: 최근 기록 영역을 같은 규칙으로 맞춘다.
- `src/entities/card/ui/thought-card2/index.tsx`: 오늘의 카드 한 장을 편집 지면 형태로 단순화한다.
- `src/entities/book/ui/sections/daily-stack/index.tsx`: Daily Stack의 제목, 탐색 버튼, 캐러셀 간격을 정리한다.
- `src/entities/book/ui/sections/deck-suggestions/index.tsx`: 중첩 카드형 제안을 한 줄 제안으로 교체한다.
- `src/entities/book/ui/books-cold-start-hero.tsx`: 최초 사용 화면에서 Sparkles와 큰 둥근 컨테이너를 제거한다.

### Task 1: Typography And Books Surface

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/entities/book/ui/books-page-client.tsx`
- Modify: `src/entities/book/ui/books-page-content.tsx`

- [ ] **Step 1: Replace the serif font with Korean coverage**

Use the existing `--font-serif` variable, changing only its source:

```tsx
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";

const notoSerif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
});

// body className
`${notoSans.variable} ${notoSerif.variable} font-sans ...`
```

- [ ] **Step 2: Scope the editorial surface to Books**

Keep the existing query and cold-start behavior. Change the page root and main layout to:

```tsx
<div className="min-h-screen bg-[#f9f8f4] text-[#292724] transition-colors duration-200 dark:bg-[#242320] dark:text-[#ebe7df]">
  {/* existing library link */}
  <main className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
    <BooksPageContent homeSummary={homeSummary} showColdStart={showColdStart} />
  </main>
  {/* existing mobile create action */}
</div>
```

Style the library link as an unfilled text action. Keep the mobile floating action circular because it is an icon-only primary action.

- [ ] **Step 3: Align loading and section rhythm**

Use the same maximum width and background in `BooksPageLoading`. Replace the rounded feature skeleton with square-to-small-radius blocks and set the populated content wrapper to `gap-14 md:gap-20`.

- [ ] **Step 4: Run static checks**

Run: `pnpm typecheck && pnpm lint`

Expected: both commands exit with code 0.

- [ ] **Step 5: Commit the foundation**

```bash
git add src/app/layout.tsx src/entities/book/ui/books-page-client.tsx src/entities/book/ui/books-page-content.tsx
git commit -m "style(books): establish editorial typography and surface"
```

### Task 2: Book Lists And Empty States

**Files:**
- Modify: `src/entities/book/ui/large-book-card/index.tsx`
- Modify: `src/entities/book/ui/empty-book-state/index.tsx`
- Modify: `src/entities/book/ui/sections/current-reading/index.tsx`
- Modify: `src/entities/book/ui/sections/jump-back-in/index.tsx`

- [ ] **Step 1: Flatten the book item**

Preserve image fallback and navigation. Remove the blurred duplicate background image and large hover lift. The cover wrapper should use:

```tsx
className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-[4px] border border-black/10 bg-muted transition-opacity group-hover:opacity-90 md:aspect-3/4 dark:border-white/10"
```

Render the real image once with `object-contain`. Use serif for the title, sans for author/progress, and terracotta only for the card count.

- [ ] **Step 2: Apply one section-header pattern**

In both book sections, use a 4-column desktop and 2-column mobile grid with a top divider:

```tsx
<section className="flex flex-col">
  <div className="flex items-end justify-between gap-4 pb-4">
    <div>
      <h2 className="font-serif text-2xl font-semibold">...</h2>
      <p className="mt-1 text-sm text-[#77726b] dark:text-[#aaa49b]">...</p>
    </div>
  </div>
  <div className="grid grid-cols-2 gap-x-5 gap-y-8 border-t border-[#d8d4cc] pt-5 md:grid-cols-4 dark:border-[#4b4842]">
    {/* existing books */}
  </div>
</section>
```

- [ ] **Step 3: Simplify the shared Books empty state**

Remove `Library`, the circular icon background, dashed border, muted fill, and button shadow. Use a top and bottom divider around centered text with a 4px primary button.

- [ ] **Step 4: Run static checks**

Run: `pnpm typecheck && pnpm lint`

Expected: both commands exit with code 0.

- [ ] **Step 5: Commit book lists**

```bash
git add src/entities/book/ui/large-book-card/index.tsx src/entities/book/ui/empty-book-state/index.tsx src/entities/book/ui/sections/current-reading/index.tsx src/entities/book/ui/sections/jump-back-in/index.tsx
git commit -m "style(books): flatten book lists and empty states"
```

### Task 3: Daily Stack Editorial Feature

**Files:**
- Modify: `src/entities/card/ui/thought-card2/index.tsx`
- Modify: `src/entities/book/ui/sections/daily-stack/index.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Remove ornamental card styling**

Keep the current props and click behavior. Change `ThoughtCard` to a borderless, shadowless two-column surface at desktop. Keep the type accessible through the tooltip, but reduce the dot to a small inline marker. Replace the pill-shaped revisit reason with plain terracotta metadata text.

Core container:

```tsx
<Card
  className={cn(
    "w-full min-w-0 rounded-none border-0 bg-transparent p-0 shadow-none",
    onClick ? "cursor-pointer" : "",
    cardClassName
  )}
>
  {/* existing book metadata, quote, thought, and saved time */}
</Card>
```

- [ ] **Step 2: Restyle the carousel shell**

Keep Embla, revisit mutation, five-second auto-advance, and navigation handlers unchanged. Add the `TODAY'S CARD` label, use a serif `h1`, square 36px icon buttons, and enclose only the content area with top and bottom dividers.

```tsx
<section className="flex flex-col">
  <p className="mb-2 text-[10px] font-medium text-[#77726b] dark:text-[#aaa49b]">TODAY&apos;S CARD</p>
  <div className="flex items-end justify-between gap-4 pb-5">...</div>
  <div className="border-y border-[#d8d4cc] py-7 dark:border-[#4b4842]">...</div>
</section>
```

- [ ] **Step 3: Simplify the zero-card state**

Reuse the same divided surface. Remove the dashed rounded panel and circular icon background, retain `아래에서 책 고르기`, and keep the smooth-scroll handler unchanged.

- [ ] **Step 4: Reduce carousel-only decorative spacing**

In `src/app/globals.css`, change only the `.embla__*` rules needed to keep one full-width editorial slide at each existing breakpoint. Do not alter toast or unrelated global styles.

- [ ] **Step 5: Run static checks**

Run: `pnpm typecheck && pnpm lint`

Expected: both commands exit with code 0.

- [ ] **Step 6: Commit Daily Stack**

```bash
git add src/entities/card/ui/thought-card2/index.tsx src/entities/book/ui/sections/daily-stack/index.tsx src/app/globals.css
git commit -m "style(books): turn daily stack into editorial feature"
```

### Task 4: Deck Suggestion And Cold Start

**Files:**
- Modify: `src/entities/book/ui/books-page-content.tsx`
- Modify: `src/entities/book/ui/sections/deck-suggestions/index.tsx`
- Modify: `src/entities/book/ui/books-cold-start-hero.tsx`

- [ ] **Step 1: Put recent books before deck suggestions**

In `BooksPageContent`, preserve all conditions and move only the component order:

```tsx
<>
  <DailyStackSection homeSummary={homeSummary} />
  <CurrentReadingSection homeSummary={homeSummary} />
  <JumpBackInSection homeSummary={homeSummary} />
  <DeckSuggestionsSection homeSummary={homeSummary} />
</>
```

- [ ] **Step 2: Replace the suggestion card with one flat row**

Keep `handleCreateDeck`, candidate IDs, route navigation, disabled state, and error toast unchanged. Remove `Bot`, `Card`, `CardContent`, `SafeImage`, `cn`, type-color maps, nested preview cards, gradients, shadows, and badges. Render each suggestion as:

```tsx
<div className="grid gap-4 border-y border-[#d8d4cc] py-5 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center dark:border-[#4b4842]">
  <div>
    <p className="text-[10px] text-[#77726b] dark:text-[#aaa49b]">
      {suggestion.candidateCardCount} CARDS
    </p>
    <h3 className="mt-1 font-serif text-lg font-semibold">{suggestion.bookTitle}</h3>
  </div>
  <p className="text-sm leading-relaxed text-[#77726b] dark:text-[#aaa49b]">
    아직 덱에 담지 않은 카드가 쌓였어요. 하나의 흐름으로 정리해 보세요.
  </p>
  <Button className="rounded-[4px]">초안 덱 만들기</Button>
</div>
```

- [ ] **Step 3: Flatten the cold-start screen**

Remove `Sparkles`, the rounded hero container, and decorative feature icons. Keep one serif heading, one explanatory paragraph, one primary action, and three future-content rows separated by rules.

- [ ] **Step 4: Run static checks**

Run: `pnpm typecheck && pnpm lint`

Expected: both commands exit with code 0 and no unused imports remain.

- [ ] **Step 5: Commit remaining Books states**

```bash
git add src/entities/book/ui/books-page-content.tsx src/entities/book/ui/sections/deck-suggestions/index.tsx src/entities/book/ui/books-cold-start-hero.tsx
git commit -m "style(books): simplify suggestions and cold start"
```

### Task 5: Production And Visual Verification

**Files:**
- Modify only files with defects found during verification.

- [ ] **Step 1: Run the full production checks**

Run: `pnpm typecheck && pnpm lint && pnpm build`

Expected: all commands exit with code 0.

- [ ] **Step 2: Start the local app**

Run: `pnpm dev:local`

Expected: Next.js reports a local URL and Books loads without a runtime error.

- [ ] **Step 3: Verify desktop and mobile**

Check `/books` at 1440×900 and 390×844 in light and dark mode. Confirm:

- no horizontal overflow or overlapping text;
- Daily Stack remains the strongest element;
- book lists are four columns on desktop and two on mobile;
- book covers preserve their aspect ratio;
- the deck suggestion becomes a vertical stack on mobile;
- focus indicators and icon-button labels remain visible;
- loading, empty, populated, and cold-start states have a terminal state.

- [ ] **Step 4: Verify existing interactions**

Open a book, open a Daily Stack card, move the carousel, add a book, visit the full library, and create a suggested draft deck. Confirm each route or mutation behaves as before.

- [ ] **Step 5: Commit verification fixes only if needed**

```bash
git add src/app/layout.tsx src/app/globals.css src/entities/book/ui src/entities/card/ui/thought-card2/index.tsx
git commit -m "fix(books): polish editorial layout across viewports"
```

Skip this commit when verification requires no code changes.
