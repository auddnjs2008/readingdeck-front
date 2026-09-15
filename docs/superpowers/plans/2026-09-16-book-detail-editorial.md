# Book Detail Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 책 정보를 계속 참고하면서 모든 독서 카드를 동일한 아코디언으로 빠르게 훑는 편집형 책 상세를 만든다.

**Architecture:** 기존 좌측 Sidebar와 우측 Content 책임, React Query 조회, 필터 상태, mutation을 유지한다. 새 컴포넌트 없이 현재 book-detail UI 파일들의 표현을 평평하게 정리하고, 제목 유무에 따라 갈라진 카드 렌더링을 하나의 아코디언 경로로 합친다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Query

---

### Task 1: 책 지면과 사이드바

**Files:**
- Modify: `src/app/(afterLogin)/(main)/books/[id]/page.tsx`
- Modify: `src/entities/book/ui/book-detail/book-detail-sidebar/index.tsx`
- Modify: `src/entities/book/ui/book-detail/book-detail-cover/index.tsx`
- Modify: `src/entities/book/ui/book-detail/book-detail-meta/index.tsx`
- Modify: `src/entities/book/ui/book-detail/book-detail-progress/index.tsx`

- [ ] **Step 1: 페이지 표면과 폭을 새 디자인에 맞춘다**

종이색 라이트·다크 배경을 적용한다. 데스크톱 좌측 고정 사이드바와 우측 유동 콘텐츠, 모바일 단일 열을 유지하고 과도한 외부 여백을 줄인다.

- [ ] **Step 2: 표지를 원본 중심으로 단순화한다**

배경 블러 복제 이미지, 큰 그림자, 큰 둥근 모서리를 제거한다. 기존 `SafeImage`와 오류 fallback을 유지하며 원본 비율과 `object-contain`으로 표시한다.

- [ ] **Step 3: 책 메타와 진행률을 평평한 요약으로 바꾼다**

제목·저자·시작일, 상태·진행률·페이지를 여백과 얇은 선으로 표현한다. `Status` 영문을 제거하고 기존 progress 계산과 값은 유지한다.

- [ ] **Step 4: 스켈레톤과 잘못된 ID 상태를 최종 구조에 맞춘다**

둥근 카드 placeholder를 제거하고 실제 사이드바 순서의 평평한 skeleton으로 바꾼다. 조회와 오류 throw 동작은 변경하지 않는다.

- [ ] **Step 5: 검증 후 커밋한다**

Run:
```bash
pnpm exec eslint 'src/app/(afterLogin)/(main)/books/[id]/page.tsx' src/entities/book/ui/book-detail/book-detail-sidebar/index.tsx src/entities/book/ui/book-detail/book-detail-cover/index.tsx src/entities/book/ui/book-detail/book-detail-meta/index.tsx src/entities/book/ui/book-detail/book-detail-progress/index.tsx
pnpm typecheck
git diff --check
```

Commit:
```bash
git add 'src/app/(afterLogin)/(main)/books/[id]/page.tsx' src/entities/book/ui/book-detail/book-detail-sidebar/index.tsx src/entities/book/ui/book-detail/book-detail-cover/index.tsx src/entities/book/ui/book-detail/book-detail-meta/index.tsx src/entities/book/ui/book-detail/book-detail-progress/index.tsx
git commit -m "style(books): simplify detail sidebar"
```

### Task 2: 접히는 독서 상태 수정

**Files:**
- Modify: `src/entities/book/ui/book-detail/book-detail-actions/index.tsx`

- [ ] **Step 1: 수정 폼 열림 상태를 추가한다**

기본값은 닫힘으로 두고 `독서 상태 수정` 버튼으로 펼친다. 펼친 상태에서 기존 상태·현재 페이지·총 페이지 입력과 저장 버튼을 그대로 제공한다.

- [ ] **Step 2: 저장 성공 후 폼을 닫는다**

기존 유효성 검사, mutation payload, 오류 메시지를 유지한다. 저장 성공 시에만 폼을 닫고, 실패하면 입력값과 열린 상태를 유지한다.

- [ ] **Step 3: 책 삭제 동작을 조용한 보조 행동으로 유지한다**

삭제 AlertDialog와 라우팅은 변경하지 않는다. 수정 폼과 삭제 버튼에서 중첩 카드 배경과 영문 `Reading Control`을 제거한다.

- [ ] **Step 4: 검증 후 커밋한다**

Run:
```bash
pnpm exec eslint src/entities/book/ui/book-detail/book-detail-actions/index.tsx
pnpm typecheck
git diff --check
```

Commit:
```bash
git add src/entities/book/ui/book-detail/book-detail-actions/index.tsx
git commit -m "style(books): collapse reading controls"
```

### Task 3: 카드 헤더와 필터 툴바

**Files:**
- Modify: `src/entities/book/ui/book-detail/book-detail-cards-header/index.tsx`
- Modify: `src/entities/card/ui/card-fiilter/index.tsx`

- [ ] **Step 1: 카드 헤더를 평평하게 바꾼다**

그라데이션, 둥근 패널, 그림자, Feather 안내 문구를 제거한다. `독서 카드`, 카드 수, 기존 `CreateCardModal`만 남기고 하단선으로 목록과 구분한다.

- [ ] **Step 2: 필터를 얇은 툴바로 바꾼다**

외곽 카드와 세로 구분선을 제거한다. 유형 라벨을 `인사이트`, `변화`, `행동`, `질문`으로 바꾸고 기존 Checkbox, 최소 한 유형 선택, 정렬, 인용 여부, 페이지 입력 동작을 유지한다.

- [ ] **Step 3: 컨트롤 형태를 단순화한다**

유형 캡슐과 입력의 과도한 pill 스타일을 제거하고 작은 체크 항목과 기본 입력으로 표현한다. 숫자 입력과 Select의 접근 가능한 라벨 구조를 유지한다.

- [ ] **Step 4: 검증 후 커밋한다**

Run:
```bash
pnpm exec eslint src/entities/book/ui/book-detail/book-detail-cards-header/index.tsx src/entities/card/ui/card-fiilter/index.tsx
pnpm typecheck
git diff --check
```

Commit:
```bash
git add src/entities/book/ui/book-detail/book-detail-cards-header/index.tsx src/entities/card/ui/card-fiilter/index.tsx
git commit -m "style(books): flatten card filters"
```

### Task 4: 통일된 카드 아코디언과 목록 상태

**Files:**
- Modify: `src/entities/book/ui/book-detail/book-detail-card/index.tsx`
- Modify: `src/entities/book/ui/book-detail/book-detail-card-list/index.tsx`

- [ ] **Step 1: 카드 렌더링 분기를 하나로 합친다**

제목 유무와 관계없이 하나의 `button` 행과 `isExpanded` 상태를 사용한다. 유형·페이지·선택적 제목을 표시하고 제목이 없으면 생각을 `line-clamp-2`로 미리보기한다.

- [ ] **Step 2: 펼친 본문을 편집형 지면으로 바꾼다**

선택적 인용문과 생각 전체를 표시하고 삭제 버튼을 유지한다. 한글 유형과 `원문 인용`, `내 생각` 라벨을 사용한다. 배경 이미지, Badge 스타일, 카드 그림자와 hover 이동을 제거하고 행 사이 구분선만 사용한다.

- [ ] **Step 3: 삭제 AlertDialog 중복을 한 경로로 줄인다**

현재 제목 있음·없음 분기에 복제된 동일 AlertDialog를 단일 반환 경로에서 한 번만 렌더링한다. mutation, 토스트, 확인 동작은 변경하지 않는다.

- [ ] **Step 4: 로딩·빈 상태를 평평하게 바꾼다**

최종 행과 같은 skeleton을 만들고 큰 점선 카드와 FileText 장식을 제거한다. IntersectionObserver와 다음 페이지 로딩 상태는 유지한다.

- [ ] **Step 5: 전체 검증과 화면 확인을 실행한다**

Run:
```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

브라우저 확인:
- 제목 있음·없음 카드가 모두 접힌 상태로 시작하고 펼쳐진다.
- 인용문이 없는 카드에 빈 인용 영역이 없다.
- 필터·정렬·페이지 범위·무한 스크롤이 유지된다.
- 독서 상태 폼은 기본 닫힘이며 성공 저장 후 닫힌다.
- 카드와 책 삭제가 동작한다.
- 모바일·데스크톱과 라이트·다크 모드에서 넘침이 없다.

- [ ] **Step 6: 커밋한다**

```bash
git add src/entities/book/ui/book-detail/book-detail-card/index.tsx src/entities/book/ui/book-detail/book-detail-card-list/index.tsx
git commit -m "style(books): unify card accordions"
```
