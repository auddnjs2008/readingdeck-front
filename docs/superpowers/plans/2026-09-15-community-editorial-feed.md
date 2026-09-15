# Community Editorial Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/community`를 공유된 문장과 생각이 먼저 읽히는 평평한 편집형 피드로 개편한다.

**Architecture:** 서버 페이지의 React Query prefetch와 hydration은 유지한다. 클라이언트 페이지는 최신 게시물과 나머지 게시물의 배치만 나누고, 피드 항목은 기존 `CommunityPost` 데이터를 문장 중심으로 다시 표현한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, Day.js

---

## File Map

- `src/app/(public)/community/page-client.tsx`: 페이지 표면, 헤더, 최신 게시물 강조, 나머지 2열 배치와 목록 상태를 담당한다.
- `src/entities/community/ui/community-feed-card.tsx`: 작성자, 문장, 생각, 책과 덱 메타데이터를 표시하는 평평한 피드 항목을 담당한다.

### Task 1: Page And Sentence-First Feed

**Files:**
- Modify: `src/app/(public)/community/page-client.tsx`
- Modify: `src/entities/community/ui/community-feed-card.tsx`

- [ ] **Step 1: Replace the decorative page surface**

Remove both gradient and dotted background layers. Match the Books and Decks editorial surface and width:

```tsx
<div className="min-h-screen bg-[#f9f8f4] text-[#292724] transition-colors dark:bg-[#242320] dark:text-[#ebe7df]">
  <main className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
    {/* header and feed */}
  </main>
</div>
```

- [ ] **Step 2: Simplify the page header**

Use a serif `커뮤니티` heading, the existing description, total count, and latest update. Remove uppercase tracking and English-first hierarchy. Keep one bottom divider and stack metadata below the title on mobile.

```tsx
<header className="flex flex-col gap-5 border-b border-[#d8d4cc] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#4b4842]">
  <div>
    <h1 className="font-serif text-3xl font-semibold">커뮤니티</h1>
    <p className="mt-2 text-sm text-[#77726b] dark:text-[#aaa49b]">
      공유된 덱을 읽고 문장과 연결을 따라가 보세요.
    </p>
  </div>
  {/* total and latestDate */}
</header>
```

- [ ] **Step 3: Make feed order explicit**

Preserve the memoized flattened posts and IntersectionObserver. Render the first post as a full-width feature, then render `posts.slice(1)` in a regular grid:

```tsx
<div className="border-b border-[#d8d4cc] dark:border-[#4b4842]">
  <CommunityFeedCard post={posts[0]} featured />
</div>
{posts.length > 1 ? (
  <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
    {posts.slice(1).map((post) => (
      <CommunityFeedCard key={post.id} post={post} />
    ))}
  </div>
) : null}
```

Remove Masonry `columns-*`. DOM order must match visual and keyboard order.

#### Feed Item

- [ ] **Step 1: Remove preview and animation dependencies**

Remove `motion`, `ArrowUpRight`, `BookOpenText`, `Network`, `Quote`, `cn`, and `CommunityPreview`. Keep `Link`, `dayjs`, Avatar components, `CommunityPost`, and `getInitials`.

- [ ] **Step 2: Replace the index prop with featured**

Use this public prop and remove animation timing:

```tsx
export function CommunityFeedCard({
  post,
  featured = false,
}: {
  post: CommunityPost;
  featured?: boolean;
})
```

- [ ] **Step 3: Render one flat linked article**

Use one `Link` for pointer and keyboard navigation. Do not add nested controls. The article has no background card, large radius, shadow, or hover lift. Use a bottom divider and an accessible focus ring.

```tsx
<article className="h-full border-b border-[#d8d4cc] dark:border-[#4b4842]">
  <Link
    href={`/community/${post.id}`}
    className="group flex h-full flex-col py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  >
    {/* author, reading content, metadata */}
  </Link>
</article>
```

- [ ] **Step 4: Put the quote or thought first**

Show author and date as compact metadata. If `primaryQuote` exists, render it as the main serif blockquote and `primaryThought` below. Otherwise render `primaryThought` as the main serif paragraph. Use `featured` only to increase type size and vertical spacing.

```tsx
{post.primaryQuote ? (
  <>
    <blockquote className={featured ? "mt-8 max-w-4xl font-serif text-3xl leading-relaxed" : "mt-6 font-serif text-xl leading-relaxed"}>
      “{post.primaryQuote}”
    </blockquote>
    <p className="mt-5 text-sm leading-7 text-foreground/85">{post.primaryThought}</p>
  </>
) : (
  <p className={featured ? "mt-8 max-w-4xl font-serif text-3xl leading-relaxed" : "mt-6 font-serif text-xl leading-relaxed"}>
    {post.primaryThought}
  </p>
)}
```

Render `caption` after the thought in muted text without duplicating empty content.

- [ ] **Step 5: Keep only useful book and deck metadata**

Remove graph/list visual previews and mode pills. At the bottom show optional book title, deck name, `List` or `Graph`, and `preview.itemCount` for list or `preview.nodeCount` for graph. Keep `덱 읽기` as the restrained primary text action.

```tsx
const deckSize = post.preview.kind === "list"
  ? `${post.preview.itemCount}개 카드`
  : `${post.preview.nodeCount}개 노드`;

<div className="mt-auto flex items-end justify-between gap-4 pt-7">
  <div className="min-w-0 text-xs text-muted-foreground">
    {post.bookTitle ? <p className="truncate">{post.bookTitle}</p> : null}
    <p className="mt-1 truncate">{post.deckName} · {post.deckMode === "graph" ? "Graph" : "List"} · {deckSize}</p>
  </div>
  <span className="shrink-0 text-xs font-semibold text-primary">덱 읽기 →</span>
</div>
```

- [ ] **Step 6: Run checks and commit the working composition**

Run: `pnpm typecheck && pnpm lint`

Expected: both commands exit with code 0; existing unrelated warnings may remain.

```bash
git add 'src/app/(public)/community/page-client.tsx' src/entities/community/ui/community-feed-card.tsx
git commit -m "style(community): make shared writing the feed focus"
```

### Task 2: Loading, Error, Empty, And Pagination States

**Files:**
- Modify: `src/app/(public)/community/page-client.tsx`

- [ ] **Step 1: Replace the initial spinner with editorial skeletons**

Render one large text skeleton followed by two smaller text skeletons. Use flat blocks and bottom dividers, not cards. Keep this branch tied only to initial `isPending`.

- [ ] **Step 2: Flatten the error and empty states**

Keep the existing messages and conditions. Replace rounded/dashed containers with a divided text area:

```tsx
<div className="border-b border-[#d8d4cc] py-12 text-sm dark:border-[#4b4842]">
  {/* existing error or empty copy */}
</div>
```

- [ ] **Step 3: Preserve pagination behavior**

Keep `loadMoreRef`, `hasNextPage`, `isFetchingNextPage`, `fetchNextPage`, the `240px` root margin, and end-of-feed thresholds unchanged. The next-page loader remains below existing posts so refetching never replaces visible content.

- [ ] **Step 4: Run checks and commit states**

Run: `pnpm typecheck && pnpm lint`

Expected: both commands exit with code 0 and IntersectionObserver dependencies remain complete.

```bash
git add 'src/app/(public)/community/page-client.tsx'
git commit -m "style(community): align feed states with editorial layout"
```

### Task 3: Production And Visual Verification

**Files:**
- Modify only defects found in the two Community files above.

- [ ] **Step 1: Run production checks**

Run: `pnpm typecheck && pnpm lint && pnpm build`

Expected: all commands exit with code 0; existing unrelated lint warnings may remain.

- [ ] **Step 2: Verify SSR content**

Run the local frontend with its normal local environment and request `/community`. Confirm the HTML response contains the page metadata and server-prefetched Community content when the local API is available.

- [ ] **Step 3: Verify desktop and mobile layouts**

Check `/community` at 1440×900 and 390×844 in light and dark mode. Confirm:

- no horizontal overflow or overlapping text;
- first post spans the full content width;
- later posts form two columns on desktop and one column on mobile;
- DOM and keyboard order match visual order;
- long quotes, author names, book names, and deck names remain contained;
- focus indicators remain visible;
- graph and list preview visuals no longer appear in the feed;
- one-post, empty, error, initial-loading, next-page-loading, and end states terminate visibly.

- [ ] **Step 4: Verify interactions**

Confirm each post opens `/community/[postId]` and infinite scrolling fetches each next page once without removing the existing feed.

- [ ] **Step 5: Commit verification fixes only if needed**

```bash
git add 'src/app/(public)/community/page-client.tsx' src/entities/community/ui/community-feed-card.tsx
git commit -m "fix(community): polish editorial feed states"
```

Skip this commit when verification finds no defect.
