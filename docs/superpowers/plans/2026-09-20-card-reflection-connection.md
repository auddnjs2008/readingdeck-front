# Card reflection and connection implementation plan

Goal: 로컬 피처 브랜치에서 반응 이력과 선택적인 다른 책 카드 연결을 사용할 수 있게 한다.

Architecture: 기존 카드 상세에 feature UI를 조합한다. 반응은 별도 테이블에 저장하고 관련 후보는 저장된 벡터를 재사용한다. 덱 연결은 트랜잭션 내에서 추가하며 전체 편집은 버전 충돌을 검출한다.

Tech stack: Next.js, React Query, NestJS, TypeORM, PostgreSQL/pgvector, Jest, 기존 브라우저 스크립트.

- [x] Backend: `src/card/card-reflection.service.ts`, entity/DTO/controller/module, migration. 요청 멱등성·소유권·삭제·관련 후보 테스트.
- [x] Backend: deck service/DTO/controller/entity에 신규 덱 요청 ID, 카드 연결 추가, 그래프 저장·발행 버전 검사. 기존 노드 보존·동시 저장·중복 요청 테스트.
- [x] Frontend: entities의 reflection/connection API, features/card의 반응 폼·연결 선택·페이지 조회. 카드 상세에 slot으로 조합하고 홈 자동 넘김 제거.
- [x] Frontend: 그래프 저장 호출에서 version 전달과 409 입력 보존. 브라우저 HTTP mock으로 실패 후 재시도, 새 덱/기존 덱 연결, 모바일, 반응 이력 삭제 확인.
- [x] Verification: backend Jest/build, frontend typecheck/lint/Node tests/build, 격리 PostgreSQL migration 및 실제 서비스 동시 저장 검증. 실제 pgvector 후보 품질과 실로그인은 미검증.
- [x] Handoff: `docs/card-reflection-local-check.md`에 두 브랜치와 실행·스키마·수동 확인 경로 문서화. 배포/운영 DB 변경 없음.

사용자가 설계를 승인했다. 구현은 이 세션에서 순서대로 진행하고 새 의존성을 추가하지 않는다. 테스트 설계·코드·검증은 에이전트가 수행하며 사용자 로컬 확인은 아직 수행되지 않았다.
