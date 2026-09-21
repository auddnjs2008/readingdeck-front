# ISBN 기반 책 정보 페이지 구현 계획

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. 이 문서는 계획이며 제품 코드 변경·DB 적용·커밋을 승인하는 명령이 아니다.

**Goal:** 개인 독서 기록과 분리된 책 정보 페이지를 제공하고, 공개 덱과 내 책 상세에서 접근하게 한다.

**Architecture:** 기존 카카오 책 검색 연동을 재사용한다. 새 책의 ISBN을 저장하고 공개 페이지는 ISBN으로만 공통 정보를 조회한다. ISBN 없는 개인 책은 인증된 기존 책 조회를 사용하며, 기존 공개 스냅샷에는 개인 데이터를 추가하지 않는다.

**Tech Stack:** Next.js App Router, React Query, NestJS, TypeORM/PostgreSQL, 기존 KakaoBookService, 기존 Jest/브라우저 검증 도구. 새 외부 API·의존성·도서 마스터 테이블 없음.

## 확정할 화면과 범위

- 공개 경로: `/book-info/[isbn]`. 비로그인 조회 가능. 검색 결과의 정확한 ISBN 일치가 확인된 정보만 표시.
- 기존 책의 보조 경로: `/books/[id]/info`. 인증·책 소유권 유지. 저장된 제목·저자·출판사·표지·소개 표시. ISBN이 있으면 공개 경로로 연결.
- 첫 연결 위치: 내 책 상세의 `책 소개 보기`, 공개 덱 상세의 리스트 출처 제목과 그래프 선택 패널의 책 제목/표지.
- 공개 덱 상단의 대표 책은 확실한 ISBN 연결이 있는 경우에만 링크. 제목 문자열만으로 스냅샷의 책을 추측하지 않는다.
- 내 덱, 카드 상세 모달, 편집기 연결은 다음 단계. 이중 모달과 편집 중 이탈 문제를 첫 범위에 넣지 않는다.
- 기존 ISBN 없는 공개 덱은 이미 공개된 표지·제목·저자·출판사 그대로 표시하고, 책 정보 링크를 만들지 않는다.
- 페이지 내용: 돌아가기 → 표지/제목/저자 → 출판사/출간일/ISBN → 책 소개 → 내 서재 행동.
- 너비 1120px, 제목 30px 세미볼드, 읽는 소개문은 적절한 내부 폭. 모바일은 표지·정보 세로 배치. HTML 소개문을 그대로 실행하지 않고 텍스트로 렌더링.
- 카카오 소개문이 없으면 `등록된 책 소개가 없어요.`. ISBN 없는 개인 책의 출간일은 생략하며 createdAt을 출간일로 사용하지 않는다.
- 직접 진입의 돌아가기는 공개 덱 목록으로, 내부 이동은 이전 화면으로. 뒤로 가기 시 기존 페이지의 스크롤을 복원하는지 검증. 임의 외부 return URL은 받지 않는다.

## 1. ISBN 저장 경로

**Backend files:** `src/book/entity/book.entity.ts`, `src/book/dto/create-book.dto.ts`, `src/book/book.service.ts`; 새 `src/book/isbn.ts`, `src/book/isbn.spec.ts`, `src/database/migrations/1790000000001-AddBookIsbn.ts`.
**Frontend files:** `src/entities/book/ui/create-book-modal/index.tsx`, `src/entities/book/ui/create-book-modal/cover-search.tsx`, `src/entities/book/api/createBook.ts`, `src/entities/book/api/getBookDetail.ts`.

- [ ] ISBN은 nullable varchar(13)로 추가한다. 기존 행은 NULL 유지. 서로 다른 사용자가 같은 책을 등록할 수 있다. ISBN이 있는 책에만 `(userId, isbn)` 부분 unique 인덱스를 추가해 같은 사용자의 반복 등록을 막고, NULL인 수동/기존 책은 영향 없이 유지한다.
- [ ] 카카오의 공백 구분 ISBN10/ISBN13 문자열을 분리하고 체크섬 검증 후 ISBN13 우선 선택. ISBN10만 유효하면 ISBN13으로 변환한다. 필드가 비어 있는 수동 등록은 허용하고, 제공된 잘못된 ISBN은 서버에서 400으로 거절한다.
- [ ] 순수 함수 테스트: `9780306406157`, `0306406152` → `9780306406157`; 두 번호가 함께 있는 경우 같은 값; 잘못된 체크섬 거절; 빈 값은 null.
- [ ] 검색 결과 → 선택 상태 → multipart ISBN → DTO → 엔티티 → 내 책 상세 응답까지 연결한다.
- [ ] 검색으로 선택한 뒤 제목/저자/출판사를 직접 바꿔 다른 책이 될 수 있으면 선택 ISBN을 해제한다. 폼 초기화/취소/새 검색 선택에서도 이전 ISBN이 남지 않게 한다. 표지 수정만으로는 ISBN을 바꾸지 않는다.
- [ ] 수동 등록·기존 생성 API 호출은 ISBN 없이도 계속 동작한다. 기존 책을 제목으로 검색해 일괄 보정하지 않는다.

## 2. 공개 책 정보 조회 API

**Backend files:** `src/book/book.controller.ts`, `src/book/book.service.ts`, `src/book/book.module.ts`, `src/integrations/kakao/kakao-book.service.ts`; 새 `src/book/book-information.spec.ts`.

- [ ] `GET /books/info/:isbn`을 공개 조회로 추가. 기존 `/books/:bookId`의 소유권 검사는 변경하지 않는다.
- [ ] 서버에서 ISBN 검증 후 `KakaoBookService.searchBooks({query: isbn, target: 'isbn'})` 호출. 결과 문서 ISBN을 정규화해 입력 ISBN과 일치하는 항목만 선택한다.
- [ ] 응답 계약은 아래 공개 필드로 제한한다. User, Book의 개인 ID, 카드, 반응, 읽기 상태는 반환하지 않는다.

```ts
type BookInformation = {
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedAt: string | null;
  description: string | null;
  coverUrl: string | null;
};
```

- [ ] 형식/체크섬 오류 400, 정확한 결과 없음 404, 카카오 장애/시간 초과 503. upstream 상세/키를 응답에 노출하지 않는다. 서버 HTTP 호출 timeout을 지정한다.
- [ ] 실제 API 응답에 맞는 필드 매핑 테스트와 카카오 어댑터 mock으로 정확한 ISBN 조회·불일치 거절·오류 분류를 검증한다.
- [ ] 별도 Redis/새 캐시 계층 없이 시작. 기존 서버 요청 중복 제거와 페이지 단위 갱신 주기를 사용하고 실패 응답은 장기 캐시하지 않는다. 장기 저장은 적용 전 제공자 정책 확인.

## 3. 공개 덱에 식별자 전달

**Backend files:** `src/community/entity/community-post.entity.ts`, `src/community/community.service.ts`.
**Frontend file:** `src/entities/community/model/types.ts`.

- [ ] snapshot.nodes[].book에 `isbn?: string | null`을 추가한다. 공유 시 해당 책의 저장된 ISBN만 복사한다.
- [ ] 기존 JSON 스냅샷은 필드가 없어도 정상 렌더링한다. 자동 재공유나 기존 스냅샷 덮어쓰기는 하지 않는다.
- [ ] 테스트: ISBN이 있는 새 공유, ISBN 없는 수동 책, 필드 없는 이전 스냅샷. 공유 취소한 덱의 정보 조회로 개인 서재를 우회하지 않는지 기존 접근권한 테스트도 실행한다.

## 4. 페이지와 개인 서재 행동

**Frontend new files:** `src/app/(public)/book-info/[isbn]/page.tsx`, `src/app/(public)/book-info/layout.tsx`, `src/entities/book/api/getBookInformation.server.ts`, `src/entities/book/ui/book-information/index.tsx`, `src/app/(afterLogin)/(main)/books/[id]/info/page.tsx`.
**Frontend existing:** `src/shared/api/fetcher.ts`, `src/widgets/top-nav/ui/index.tsx`, `src/entities/book/model/queries/useBookCreateMutation.ts`.

- [ ] 서버 공개 페이지는 기존 serverFetcher/404 처리 패턴 재사용. 개인 서재 상태는 별도 클라이언트 조회로 분리해 공개 응답에 섞이지 않게 한다.
- [ ] 공개 경로를 인증 인터셉터의 비로그인 허용 목록에 추가한다. 프로필 확인이 401이어도 책 정보 페이지에서 로그인으로 강제 이동하지 않는다.
- [ ] 로딩/정보 없음/일시 오류와 재시도 상태를 제공한다. 제목을 페이지 metadata에 반영한다.
- [ ] 로그인 전에는 `로그인하고 서재에 추가`, 로그인 후에는 `내 서재에 추가`. 같은 ISBN이 이미 있으면 `내 기록 보기`.
- [ ] 내 서재 존재 확인은 기존 GET /books에 ISBN 정확 일치 필터를 추가해 로그인 사용자 안에서 1건만 조회한다. 전체 서재를 내려받아 비교하지 않는다. 기존 ISBN 없는 책과 제목만으로 중복 판정하지 않는다.
- [ ] 책 추가는 기존 생성 mutation을 사용하고, pending 중 중복 클릭 방지. 서버에서도 ISBN이 있는 같은 사용자·같은 ISBN의 생성은 동일 책 반환으로 처리한다. Task 1의 부분 unique 인덱스로 동시 생성을 막고, 해당 제약 충돌에만 기존 책을 반환한다. 기존 책의 읽기 상태/표지/메모는 덮어쓰지 않는다. 재판/다른 판본은 다른 ISBN으로 구분.
- [ ] 기존 책 보조 페이지는 개인 조회를 재사용하며 `내 기록 보기`만 제공한다. 공개 페이지로 개인 소개문을 전달하지 않는다.

## 5. 첫 진입점 연결과 검증

**Files:** `src/entities/book/ui/book-detail/book-detail-sidebar/index.tsx`, `src/entities/community/ui/community-post-card-list/index.tsx`, `src/entities/community/ui/community-post-graph-view/index.tsx`; 새 `scripts/browser/book-information-check.mjs`.

- [ ] ISBN 있는 책은 공개 정보 URL로, 내 서재의 ISBN 없는 책은 인증된 info URL로 연결한다. 링크의 accessible name은 책 제목 또는 `책 소개 보기`로 한다.
- [ ] 그래프 노드 클릭/드래그는 기존 동작 유지. 책 정보 이동은 선택 후 상세 패널에서만 제공한다.
- [ ] mock API로 모바일/데스크톱의 공개 덱 → 책 정보 → 뒤로 가기, 내 책 → 정보 → 내 기록 흐름을 검증한다.
- [ ] 비로그인 조회, 로그인 CTA, 기존 등록/미등록, 소개 없음, 표지 없음, 긴 제목, 404, upstream 실패/재시도, 기존 ISBN 없는 책과 이전 공개 스냅샷을 확인한다.
- [ ] SSR 요청은 page.route로 가로챌 수 없으므로 별도 로컬 mock API를 사용한다. 실제 사용자 계정/데이터에 쓰기 요청을 보내지 않는다.
- [ ] 프론트 `pnpm typecheck`, 변경 파일 ESLint, `pnpm build`; 백엔드 관련 Jest와 `pnpm exec tsc --noEmit --incremental false`; 양쪽 `git diff --check` 실행.

## 적용과 완료 기준

- 구현 시 프론트·백엔드 각각 `feat/book-information` 브랜치 사용. 이 계획 작성 단계에서는 브랜치/제품 코드를 변경하지 않는다.
- 적용 순서: nullable DB 컬럼 → 백엔드 저장/조회/스냅샷 호환 → 프론트 ISBN 전달과 정보 페이지.
- 운영 DB migration과 배포는 별도 승인 후 실행. 기존 책/기존 공개 덱은 필드 없이도 사용 가능해야 한다.
- 완료 기준: 독서 기록과 공개 책 정보가 분리되고, ISBN이 정확한 경우만 연결되며, 새 모달 없이 페이지를 이동하고 돌아올 수 있다.
- 유보: 제목 기반 자동 매칭, 기존 데이터 일괄 ISBN 채우기, 네이버/Google 병합, 긴 출판사 소개 수집, 모든 편집 화면에 동시 적용.
