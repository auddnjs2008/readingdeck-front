# Community Editorial Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 커뮤니티 상세를 공유 글부터 읽고 덱을 탐색하는 평평한 편집형 화면으로 개편한다.

**Architecture:** 기존 `CommunityPostReader`의 서버 데이터와 클라이언트 상태 흐름을 유지한다. 새 컴포넌트 없이 Hero, 덱 컨테이너·탭, 카드 목록·그래프, 댓글, 스켈레톤의 표현만 순서대로 정리한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query

---

### Task 1: 글 우선 상세 헤더

**Files:**
- Modify: `src/entities/community/ui/community-post-hero/index.tsx`
- Modify: `src/entities/community/ui/community-post-reader/index.tsx`

- [ ] **Step 1: 중복 콘텐츠 조건을 정리한다**

`primaryQuote`, `primaryThought`, `caption`, `deckDescription`을 trim하고, 앞에서 이미 출력한 값과 같은 보조 문단은 렌더링하지 않는다. 별도 유틸은 만들지 않고 Hero 내부의 지역 변수로 둔다.

```tsx
const quote = post.primaryQuote?.trim();
const thought = post.primaryThought.trim();
const caption = post.caption?.trim();
const description = post.deckDescription?.trim();
const showThought = thought && thought !== quote;
const showCaption = caption && caption !== quote && caption !== thought;
const showDescription =
  description &&
  description !== quote &&
  description !== thought &&
  description !== caption;
```

- [ ] **Step 2: Hero를 읽기 지면으로 바꾼다**

그라데이션과 영문 배지를 제거한다. 복귀·원본 덱 링크, 작성자·날짜·책 정보, 큰 인용문과 보조 문단, 덱 메타 순서로 출력한다. 본문은 `max-w-4xl`, 전체 지면은 기존 Reader 폭 안에서 유지한다.

- [ ] **Step 3: Reader 외곽 레이아웃을 평평하게 바꾼다**

`rounded-[34px]`, `bg-card`, 큰 shadow를 제거하고 Hero와 덱 뷰 사이를 여백과 `border-t`로 구분한다. `activeView`, 소유자 판별, 스크롤 버튼 로직은 변경하지 않는다.

- [ ] **Step 4: 정적 검증 후 커밋한다**

Run:
```bash
pnpm exec eslint src/entities/community/ui/community-post-hero/index.tsx src/entities/community/ui/community-post-reader/index.tsx
pnpm typecheck
```

Expected: exit code 0.

Commit:
```bash
git add src/entities/community/ui/community-post-hero/index.tsx src/entities/community/ui/community-post-reader/index.tsx
git commit -m "style(community): make detail reading first"
```

### Task 2: 덱 탐색 영역

**Files:**
- Modify: `src/entities/community/ui/community-post-view-tabs/index.tsx`
- Modify: `src/entities/community/ui/community-post-card-list/index.tsx`
- Modify: `src/entities/community/ui/community-post-graph-view/index.tsx`

- [ ] **Step 1: 모드 전환을 밑줄 탭으로 바꾼다**

기존 `button`과 `onViewChange`를 유지하고 캡슐 배경·그림자를 제거한다. 선택 탭은 테라코타 텍스트와 하단선으로 표시하며 `aria-pressed`를 추가한다.

```tsx
<button type="button" aria-pressed={activeView === "graph"}>그래프로 보기</button>
<button type="button" aria-pressed={activeView === "list"}>목록으로 읽기</button>
```

- [ ] **Step 2: List 카드를 순차 읽기 지면으로 바꾼다**

각 항목의 둥근 카드, 그림자, hover 장식을 제거한다. 순번·카드 유형·페이지를 작은 메타 행에 두고 인용문과 생각을 아래에 배치하며 항목 간 얇은 구분선만 유지한다.

- [ ] **Step 3: Graph 외곽을 단순화한다**

그래프와 선택 노드 패널의 큰 모서리와 장식 헤더를 제거한다. 그래프 계산, SVG 노드 선택, 연결 강조, 책 표지 렌더링은 그대로 둔다.

- [ ] **Step 4: 정적 검증 후 커밋한다**

Run:
```bash
pnpm exec eslint src/entities/community/ui/community-post-view-tabs/index.tsx src/entities/community/ui/community-post-card-list/index.tsx src/entities/community/ui/community-post-graph-view/index.tsx
pnpm typecheck
```

Expected: exit code 0.

Commit:
```bash
git add src/entities/community/ui/community-post-view-tabs/index.tsx src/entities/community/ui/community-post-card-list/index.tsx src/entities/community/ui/community-post-graph-view/index.tsx
git commit -m "style(community): simplify shared deck reader"
```

### Task 3: 댓글 지면

**Files:**
- Modify: `src/entities/community/ui/community-comments.tsx`

- [ ] **Step 1: 댓글 외곽과 제목을 정리한다**

`Discussion`과 장식 아이콘을 제거하고 `댓글` 제목을 사용한다. section의 둥근 카드·그림자를 제거하고 상단선과 세로 여백으로 덱 영역과 구분한다.

- [ ] **Step 2: 입력·상태 표현을 평평하게 바꾼다**

댓글 및 답글 입력의 중첩 카드 배경을 제거한다. 로딩, 오류, 빈 상태도 큰 둥근 컨테이너 대신 짧은 문장과 구분선으로 표현한다. 작성·답글·삭제·더 보기 함수는 수정하지 않는다.

- [ ] **Step 3: 정적 검증 후 커밋한다**

Run:
```bash
pnpm exec eslint src/entities/community/ui/community-comments.tsx
pnpm typecheck
```

Expected: exit code 0.

Commit:
```bash
git add src/entities/community/ui/community-comments.tsx
git commit -m "style(community): flatten detail comments"
```

### Task 4: 상세 로딩과 전체 검증

**Files:**
- Modify: `src/entities/community/ui/community-post-detail/index.tsx`

- [ ] **Step 1: 스켈레톤을 최종 레이아웃에 맞춘다**

큰 카드와 캡슐 placeholder를 제거한다. 복귀 링크, 작성자 메타, 읽기 본문, 덱 영역, 댓글 영역 순서의 평평한 skeleton을 만든다.

- [ ] **Step 2: 전체 정적 검증을 실행한다**

Run:
```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

Expected: 모두 exit code 0. 기존 ESLint warning은 증가하지 않아야 한다.

- [ ] **Step 3: 브라우저에서 핵심 상태를 확인한다**

확인 항목:
- List 덱은 공유 글 다음에 카드가 순서대로 보인다.
- Graph 덱은 기본 Graph와 List 전환이 동작한다.
- 같은 인용·생각·설명이 중복되지 않는다.
- 로그인 사용자는 댓글 작성 UI, 비로그인 사용자는 로그인 링크가 보인다.
- 375px 모바일과 데스크톱에서 가로 넘침과 텍스트 겹침이 없다.
- 라이트·다크 모드에서 본문과 구분선 대비가 유지된다.

- [ ] **Step 4: 커밋한다**

```bash
git add src/entities/community/ui/community-post-detail/index.tsx
git commit -m "style(community): align detail loading state"
```
