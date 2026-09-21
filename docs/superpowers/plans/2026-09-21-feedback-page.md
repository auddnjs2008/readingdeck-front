# 의견 보내기 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task, inline in this session. Steps use checkboxes for tracking.

**Goal:** 서비스 의견 접수를 채팅에서 독립 페이지로 옮기고 홈·프로필·랜딩에서 발견할 수 있게 한다.

**Architecture:** 기존 공개 POST /feedback과 mutation을 재사용한다. 유형과 선택 이메일만 nullable 필드로 추가하여 기존 클라이언트와 AI 답변 평가를 호환한다. 별도 관리자 화면이나 알림 인프라는 만들지 않는다.

**Tech Stack:** Next.js App Router, React Query, 기존 공용 UI, NestJS, class-validator, TypeORM/PostgreSQL.

## 확정할 화면과 범위

- 공개 `/feedback` 페이지. 로그인하지 않아도 작성 가능하고 모달을 중첩하지 않는다.
- 제목 `의견 보내기`, 설명 `쓰면서 불편했던 점이나 바라는 기능을 알려주세요.`
- 유형: `불편해요 / 제안해요 / 기타`, 기본값 기타. 이름·제목·첨부파일 생략.
- 내용: 필수, 공백 제거 후 2~2000자. 입력 안내에 화면 이름과 불편했던 상황을 적도록 제안.
- 답변받을 이메일: 선택. 사용자 후속 요청에 따라 자동 채움과 예시 placeholder를 제거하고 빈칸으로 시작한다.
- 이메일 안내: `답변이 필요하면 이메일을 남겨주세요. 비워두어도 의견을 보낼 수 있어요.` 개인정보처리방침 링크 제공.
- 전송 중 중복 제출 차단. 실패하면 입력 유지 + 인라인 오류 + 재시도. 성공하면 접수 완료 화면을 유지해 같은 내용을 다시 보내지 않게 한다.
- 성공 문구: `의견을 보내주셔서 감사해요.` 이메일을 제출했을 때만 `답변이 필요하면 남겨주신 이메일로 연락드릴게요.` 추가. 즉시 답변이나 자동 이메일 발송을 약속하지 않는다.
- 홈 아래 안내는 책이 없는 신규 사용자에게도 표시한다. 프로필의 계정과 지원에 고정 링크, 랜딩 푸터의 기존 문의하기는 의견 보내기로 교체한다.
- `/support`는 기존 이메일 문의를 유지하고 의견 보내기로 연결한다.
- 채팅은 AI 대화만 남긴다. AI 답변 평가와 사용량·출처·로그인 처리는 유지한다.

## Task 1: 기존 접수 API 확장

백엔드 루트: `/Users/kmw/Projects/readingDeck/readingdeck-back`.

**Modify:**
- `src/feedback/dto/create-feedback.dto.ts`
- `src/feedback/entity/feedback.entity.ts`
- `src/feedback/feedback.service.ts`

**Create:**
- `src/database/migrations/1790000000002-AddFeedbackContact.ts`
- `src/feedback/feedback.spec.ts`

- [ ] 양쪽 dev가 깨끗한지 확인 후 각각 `feat/feedback-page` 브랜치를 만든다. 기존 작업이 있으면 덮어쓰지 않는다.
- [ ] DTO에 optional `category: 'problem' | 'suggestion' | 'other'`, `replyEmail?: string`을 추가한다. `@IsIn`, `@IsEmail`, `@MaxLength(254)`로 검증한다. 빈 이메일은 undefined로, 문자열 message/pagePath/email은 검증 전에 trim한다. 공백뿐인 message는 400.
- [ ] entity에 category varchar(16) nullable, replyEmail varchar(254) nullable을 추가한다. migration up은 두 컬럼 추가, down은 두 컬럼 제거. 기존 행을 임의 분류하지 않는다.
- [ ] 서비스는 검증된 category/replyEmail을 저장하고 미전달 값은 null. 기존 userId/message/pagePath 저장과 `{ ok: true }` 응답은 유지한다.
- [ ] 테스트: 비회원 접수 userId null, 유형/이메일 저장, 기존 message-only 요청과 AI_REACTION 저장, 공백 내용/잘못된 유형/잘못된 이메일 거절. 실패하는 테스트를 확인하고 구현 후 통과시킨다.
- [ ] `pnpm exec jest --runInBand feedback.spec.ts`와 `pnpm exec tsc --noEmit --incremental false` 실행. 실제 DB 변경은 현재 synchronize/스키마 상태를 확인한 뒤 수행하며 migration 파일 작성과 실행을 구분해 보고한다.

## Task 2: 독립 작성 페이지

**Create:**
- `src/app/(public)/feedback/page.tsx`: metadata와 공개 페이지 틀, 기존 TopNav 사용.
- `src/features/feedback/create-feedback/ui/index.tsx`: 폼, 프로필 이메일 초기화, 접수 상태.

**Modify:**
- `src/features/feedback/create-feedback/api/createFeedback.ts`: optional category/replyEmail 타입 추가.
- `src/shared/api/fetcher.ts`: 공개 optional-auth 경로에 `/feedback` 포함.
- `src/shared/api/community-access.test.mjs`: 만료 세션으로 피드백 페이지를 열어도 로그인 페이지로 튕기지 않는 회귀 확인.

- [ ] 기존 useFeedbackCreateMutation과 공용 Button/Input/Textarea/Label을 재사용한다. 유형은 native radio 그룹으로 키보드 접근 가능하게 구현한다. 추가 폼 라이브러리 불필요.
- [ ] 선택 프로필 조회는 retry false. 조회 실패가 폼 작성을 막지 않게 하고, 이메일 초기값과 사용자 편집 여부를 구분한다.
- [ ] 요청 body는 아래 계약을 따른다. 이메일을 지우면 계정 이메일을 다시 끼워 넣지 않는다.

```ts
{
  message: message.trim(),
  category,
  replyEmail: email.trim() || undefined,
  pagePath: sourcePath,
}
```

- [ ] source는 링크의 `?from=/books`처럼 pathname만 전달한다. 프론트에서 `/`로 시작하고 `//`, `?`, `#`가 없는 내부 pathname, 길이 255 이하만 인정하고 나머지는 `/feedback`으로 대체한다. 인증 토큰이나 현재 URL 전체를 저장하지 않는다. source를 이동 URL로 사용하지 않는다.
- [ ] 글자 수와 오류는 label에 연결하고 전송 결과는 aria-live로 알린다. 전송 실패 시 원문 유지, 성공 시 완료 문구와 홈 링크 표시.
- [ ] 디자인은 기존 배경·테두리·타이포 토큰을 사용한다. 페이지 제목 30px semibold, 폼 최대 너비 약 640px, 모바일 20px 좌우 여백. 새 디자인 시스템을 만들지 않는다.

## Task 3: 진입점 이동과 채팅 정리

**Modify:**
- `src/entities/book/ui/books-page-client.tsx`
- `src/features/me/delete-account/ui/index.tsx`
- `src/app/page-client.tsx`
- `src/app/support/page.tsx`
- `src/widgets/assistant-widget/ui/index.tsx`

- [ ] 홈의 BooksPageContent 바깥, 같은 main 하단에 안내를 둔다. cold-start의 조기 return에 가려지지 않도록 client에 배치한다.

```tsx
<aside className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
  쓰면서 불편한 점이 있었나요?{" "}
  <Link href="/feedback?from=/books" className="text-primary underline underline-offset-4">
    의견 보내기
  </Link>
</aside>
```

- [ ] 프로필 AccountSupportSection 메뉴에 `의견 보내기 → /feedback?from=/profile` 추가. 기존 고객지원은 이메일 문의·정책 안내 역할로 유지.
- [ ] 랜딩 푸터의 mailto 문의하기를 `/feedback?from=/` 링크로 교체. support 페이지에도 `/feedback?from=/support` 링크 제공.
- [ ] 위젯의 feedback 탭, 인사말, 메시지 state, 일반 피드백 submit 분기와 탭 UI를 제거한다. activeTab 상태 자체를 없애고 AI 분기를 직접 사용한다.
- [ ] `aiFeedbackCreateMutation`과 handleAiReaction은 유지한다. API 재사용 여부만 보고 feedback 관련 코드를 일괄 삭제하지 않는다.
- [ ] 열기 버튼 title/aria-label을 `AI 독서 대화`로 변경한다. 비회원은 기존 AI 로그인 안내를 보게 한다. 사용량 제한, 스트리밍, 출처 카드, 포커스 복귀 동작을 보존한다.

## Task 4: 검증과 운영 확인

**Create:** `scripts/browser/feedback-check.mjs` — 기존 book-information-check의 isolated Next/mock API 방식을 참고하되 공용 테스트 인프라 추출은 하지 않는다.

- [ ] 공개 폼 비회원 제출, 로그인 이메일 초기값/삭제 유지, 500 후 입력 유지/재전송, pending 중 POST 1회, 성공 안내를 검증한다. 실제 사용자 의견을 테스트로 전송하지 않는다.
- [ ] 신규 빈 홈과 일반 홈 모두 링크 노출, 프로필/랜딩 링크 이동, 채팅에서 일반 피드백 탭 제거 및 AI 평가 요청 유지 확인.
- [ ] 모바일 390px/데스크톱 1280px, 밝은/어두운 테마, 키보드 조작, 하단 고정 UI와 겹침 확인.
- [ ] 프론트 `pnpm typecheck`, 변경 파일 ESLint, `node --test src/shared/api/community-access.test.mjs`, 위 브라우저 검사, `pnpm build` 실행. 양쪽 `git diff --check` 실행.
- [ ] 현 피드백은 DB 저장뿐이며 관리자 알림/자동 답장 시스템이 없음을 최종 보고에 명시한다. 접수 내역은 기존 운영 DB 조회로 확인하고 답변은 수동 이메일로 처리하는 범위다. 외부 메시지 전송은 구현·테스트 중 수행하지 않는다.
- [ ] 개인정보처리방침에서 새 선택 이메일 수집 안내가 기존 설명과 맞는지 확인하고, 실제 운영 방침이 정해지지 않은 보유기간 등을 임의로 작성하지 않는다.
- [ ] 사용자에게 로컬 확인 경로와 검사 결과를 보고한다. 커밋/머지는 별도 요청 때 수행한다.

## 이번 범위에서 제외

공개 제안 게시판, 투표, 처리 상태 추적, 파일 업로드, 관리자 대시보드, Slack/이메일 알림 연동, 자동 답장, 새 플로팅 버튼, 통계 페이지.


## 구현 결과 (2026-09-21)

- 양쪽 `feat/feedback-page`에서 구현 완료, 커밋/머지 전.
- 공개 폼, 홈(빈 상태 포함)·프로필·랜딩·고객지원 링크, AI 채팅 분리 구현.
- 기존 API와 mutation을 재사용하고 nullable category/replyEmail 및 migration 추가.
- 사용자 후속 요청 반영: 이메일은 빈칸으로 시작하고 계정 이메일 자동 입력과 예시 placeholder를 제거했다.
- backend feedback.spec.ts: 변경 전 7개 실패 확인, 구현 후 7개 통과. 타입 검사 통과.
- frontend 타입 검사, 변경 파일 ESLint, 공개 인증 회귀 7개, 프로덕션 빌드 통과.
- HTTP mock 브라우저 검사: 390/1280px 비회원 접수, 이메일 수정/삭제, 실패 후 초안 보존과 재시도, 중복 제출 차단, 신규/기존 홈·프로필·랜딩 입구, AI 평가 유지 통과.
- 테스트는 실제 API/DB에 쓰지 않음. 개발 도구 버튼이 AI 런처를 가려 테스트에서 개발 도구 오버레이만 숨김.
- DB migration 파일만 작성. 수동 실행하지 않았으며 실제 DB 상태는 검증하지 않음. 로컬 설정은 비 production에서 synchronize를 사용함.
- 운영자 알림/자동 답장은 추가하지 않음. 개인정보 안내는 실제 수집 항목과 사용 목적만 반영하고 미정 보유기간은 추가하지 않음.
