# Card Detail Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 독립 카드 상세와 인터셉트 모달을 생각 중심의 동일한 편집형 읽기 화면으로 개편한다.

**Architecture:** 기존 `CardDetailScene`의 React Query 조회와 라우팅을 유지한다. `CardDetailView`가 페이지·모달의 공통 콘텐츠 순서를 소유하고 `variant`는 크기, 스크롤, 닫기 배치만 다르게 표현한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query, Radix Dialog

---

### Task 1: 공통 카드 읽기 지면

**Files:**
- Modify: `src/entities/card/ui/card-detail-view.tsx`

- [ ] **Step 1: 공통 표시 값을 정리한다**

카드 유형 한글 라벨, 페이지 범위, 저장일, 선택적 제목과 인용문 여부를 기존 컴포넌트 지역 값으로 유지한다. `cardStyles`, `Badge`, 장식용 `Quote` 의존은 제거한다.

```tsx
const CARD_LABELS = {
  insight: "인사이트",
  change: "변화",
  action: "행동",
  question: "질문",
} satisfies Record<ResGetCardDetail["type"], string>;
```

- [ ] **Step 2: 독립 페이지를 생각 중심 단일 지면으로 바꾼다**

큰 둥근 카드, 그라데이션, 그림자를 제거한다. 카드 유형·페이지, 선택적 제목, 큰 명조 생각, 선택적 원문 인용, 책 메타, 다시 본 횟수, 책 상세 링크 순서로 출력한다. 테라코타는 유형과 주요 링크에만 사용한다.

- [ ] **Step 3: 모달을 같은 순서의 압축판으로 바꾼다**

중복된 헤더 유형과 Badge를 제거하고 닫기 버튼만 우측 상단에 둔다. 독립 페이지와 동일한 순서로 콘텐츠를 출력하되 작은 글자와 여백을 사용한다. 본문 스크롤과 하단 책 상세 링크를 유지한다.

- [ ] **Step 4: 검증 후 커밋한다**

Run:
```bash
pnpm exec eslint src/entities/card/ui/card-detail-view.tsx
pnpm typecheck
git diff --check
```

Expected: exit code 0.

Commit:
```bash
git add src/entities/card/ui/card-detail-view.tsx
git commit -m "style(cards): make detail reading focused"
```

### Task 2: 페이지와 모달 외곽

**Files:**
- Modify: `src/app/(afterLogin)/(main)/cards/[cardId]/page.tsx`
- Modify: `src/entities/card/ui/card-detail-modal-shell.tsx`

- [ ] **Step 1: 독립 페이지 배경과 간격을 맞춘다**

`900px` 읽기 폭을 유지하고 Books·Decks·Community와 같은 종이색 라이트·다크 배경을 사용한다. `CardDetailScene`의 책임과 경로는 변경하지 않는다.

- [ ] **Step 2: 모달 껍데기를 단순화한다**

과한 그림자와 카드색 표면을 줄이고 공통 상세 지면과 같은 배경을 적용한다. Radix `DialogTitle`, 열림 상태, `router.back()` 닫기 동작은 그대로 유지한다.

- [ ] **Step 3: 검증 후 커밋한다**

Run:
```bash
pnpm exec eslint 'src/app/(afterLogin)/(main)/cards/[cardId]/page.tsx' src/entities/card/ui/card-detail-modal-shell.tsx
pnpm typecheck
git diff --check
```

Expected: exit code 0.

Commit:
```bash
git add 'src/app/(afterLogin)/(main)/cards/[cardId]/page.tsx' src/entities/card/ui/card-detail-modal-shell.tsx
git commit -m "style(cards): align detail page and modal"
```

### Task 3: 로딩 상태와 전체 검증

**Files:**
- Modify: `src/entities/card/ui/card-detail-scene.tsx`

- [ ] **Step 1: 로딩 스켈레톤을 읽기 순서에 맞춘다**

캡슐과 둥근 카드 모양을 제거하고 유형·생각·인용·책 메타 순서의 평평한 skeleton으로 바꾼다. `role=status`, 접근 가능한 라벨, 잘못된 ID, 오류 재시도, 조회 쿼리는 변경하지 않는다.

- [ ] **Step 2: 전체 검증을 실행한다**

Run:
```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

Expected: 모두 exit code 0. 기존 lint warning은 증가하지 않는다.

- [ ] **Step 3: 브라우저에서 핵심 상태를 확인한다**

확인 항목:
- 독립 페이지와 모달이 유형, 제목, 생각, 인용, 책 정보 순서로 표시된다.
- 제목 또는 인용문이 없어도 불필요한 빈 영역이 생기지 않는다.
- 긴 생각과 인용문이 모바일에서 가로로 넘치지 않는다.
- 모달 본문 스크롤, 닫기, 책 상세 이동이 동작한다.
- 잘못된 ID와 조회 오류 상태가 기존처럼 동작한다.
- 라이트·다크 모드에서 대비가 유지된다.

- [ ] **Step 4: 커밋한다**

```bash
git add src/entities/card/ui/card-detail-scene.tsx
git commit -m "style(cards): align detail loading state"
```
