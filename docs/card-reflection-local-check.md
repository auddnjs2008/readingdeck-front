# 카드 반응·연결 로컬 확인

두 저장소 모두 `dev`에서 분기한 `feat/card-reflection-connection` 브랜치에서 구현했다.

## 실행

백엔드 터미널:

```sh
cd /Users/kmw/Projects/readingDeck/readingdeck-back
pnpm start:local
```

프론트 터미널:

```sh
cd /Users/kmw/Projects/readingDeck/readingdeck-front
pnpm dev:local
```

프론트는 http://localhost:4000, 백엔드는 기본 http://localhost:5500 이다. 프론트 `env/.env.local`의 API 주소도 5500이다. 이미 실행 중이면 같은 포트에 중복 실행하지 않는다.

기존 백엔드 설정은 `ENV=local`에서 TypeORM `synchronize: true`이므로 시작할 때 연결된 로컬 DB에 `card_reflection` 테이블과 `deck.requestId` 컬럼·유일 인덱스가 생성된다. 사용자의 DB에 직접 마이그레이션을 실행하지 않았다.

명시적 migration을 사용하는 환경에는 `1790000000000-AddCardReflection.ts`를 추가했다. 자동 동기화로 같은 스키마를 이미 만든 DB에 이 migration을 중복 적용하지 않는다. 운영에서는 기존 배포 절차에 따라 migration을 먼저 적용한다. 그래프 저장·발행 API의 `expectedVersion`이 필수이므로 프론트와 백엔드를 함께 갱신한다.

## 확인 순서

오늘의 카드를 열어 읽기 시작하면 홈에 머무르는 동안 해당 스택과 순서를 유지한다. 재방문 저장으로 추천 목록이 갱신되어도 모달 닫기·생각 저장 후 마치기가 카드를 바꾸지 않는다. 홈을 새로 열거나 새로고침하면 최신 추천을 표시한다.

1. 로그인 후 서로 다른 책 두 권에 카드를 한 장씩 만든다. 기존 카드도 가능하다.
2. 홈 또는 카드 상세의 `지금의 생각 남기기`를 누른다. 카드 본문을 누르면 원문과 반응 이력만 표시되는 상세보기가 열린다.
3. 네 가지 반응 중 하나를 선택하고 선택 메모를 작성한 뒤 저장한다.
4. 저장하면 입력 폼 대신 완료 화면이 나온다. `마치기`만 눌러 끝낼 수 있으며 연결은 선택 사항이다. 원본 카드 내용은 유지된다.
5. 완료 화면의 `다른 카드와 연결하기`를 누르면 같은 화면이 카드 선택 단계로 바뀐다. 후보 또는 `직접 찾기`로 다른 책의 카드를 고른다.
6. 카드 선택 후 관계와 덱 설정 화면으로 바뀐다. 새 비공개 덱 또는 기존 비공개 그래프 초안에 저장한다. `카드 다시 고르기`로 앞 단계에 돌아갈 수 있다.
7. `연결된 덱 보기`에서 두 카드와 관계 라벨을 확인한다. 반응 메모는 덱에 자동 복사되지 않는다.
8. 카드 상세를 다시 열어 반응 이력을 확인하고, 삭제 버튼으로 이력 하나만 삭제해 본다.

임베딩이 없는 기존 카드는 추천 후보가 나오지 않을 수 있다. 이때 직접 찾기는 사용할 수 있다. 관련 후보 조회는 저장된 벡터끼리 비교하며 외부 AI API를 호출하지 않는다. 기존 카드 생성·수정의 임베딩 생성 동작은 유지된다.

## 검증 명령

프론트:

```sh
pnpm typecheck
pnpm build
node --test src/shared/api/auth-retry.test.mjs src/shared/api/community-access.test.mjs src/entities/book/model/queries/book-cache.test.mjs
```

브라우저 검증은 기존 Playwright 설치를 사용한다. 의존성을 추가하지 않았으며 설치 경로를 명시할 수 있다. 프론트 서버를 먼저 실행한다.

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs CHECK_ORIGIN=http://localhost:4000 node scripts/browser/reflection-check.mjs
```

이 스크립트는 격리 브라우저 컨텍스트에서 HTTP 요청을 모킹한다. 실제 사용자 데이터에는 쓰지 않는다. 상세/입력 분리, 저장 후 완료 화면, 연결 단계 전환과 돌아가기, 반응 실패/재시도와 요청 ID 유지, 이력 삭제, 신규 덱 재시도, 추천 실패 시 직접 선택, 기존 덱 추가, 모바일, 모달 닫기와 마치기를 검증한다.

백엔드:

```sh
pnpm test --runInBand
pnpm build
REFLECTION_TEST_DATABASE_URL=postgresql://USER@127.0.0.1:PORT/postgres node -r ts-node/register -r tsconfig-paths/register src/scripts/check-card-reflection.ts
```

DB 스크립트는 명시적으로 지정한 로컬 테스트 DB에 무작위 전용 schema를 만들고 종료 시 자신이 만든 schema만 제거한다. 앱 환경 파일은 읽지 않는다. migration down/up, 반응·덱·연결 동시 요청 멱등성, 소유권, 원문 유지, 그래프 저장·발행 버전 충돌, 발행 덱 연결 거절, 카드 삭제 시 반응 삭제를 검증한다.

로컬 PostgreSQL에는 pgvector가 없어 실제 벡터 검색 SQL의 실행과 후보 품질은 별도로 확인해야 한다. Jest에서는 추천 없음과 소유권 차단을, 브라우저에서는 추천 성공·실패 UI를 검증했다. 실제 로그인과 사용자 DB를 연결한 종단 검증은 사용자의 로컬 확인 단계로 남는다.

## 범위와 검증 주체

사용자가 기능 구성과 두 피처 브랜치 구현을 승인했다. 코드·테스트 설계 및 자동 검증은 에이전트가 수행했다. 사용자 로컬 확인은 아직 수행하지 않았다.

분석 이벤트 수집 경로가 없어 새 분석 플랫폼은 설치하지 않았다. 반응·연결 사용률과 7일 재방문율을 운영에서 측정하려면 기존 분석 수단을 정한 뒤 노출/완료 이벤트를 연결해야 한다. 원문과 반응 메모를 분석 로그에 넣지 않는다.

초기 이력은 반응 시각과 메모를 저장하며, 원본 카드의 모든 편집 버전을 보관하지 않는다. 연결은 덱 안에 저장되므로 덱을 삭제하면 해당 연결도 삭제된다.
