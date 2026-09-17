# Deck Create Editorial Design

## Goal

`/decks/create`를 ReadingDeck의 편집형 디자인과 맞추면서 기존 덱 생성, 저장, 발행 흐름은 그대로 유지한다.

## Direction

별도 생성 마법사를 추가하지 않는다. 사용자는 지금처럼 편집기로 바로 들어오며, 편집기 안에서 덱 정보와 카드 선택 순서를 자연스럽게 이해한다.

## Screen Structure

- 편집기 내비게이션은 그림자와 과한 캡슐 형태를 줄이고 얇은 구분선과 간결한 명령 위계로 정리한다.
- 리스트/그래프 전환은 작은 도구형 세그먼트로 유지하되 한국어 레이블을 사용한다.
- 초안 진행 안내는 독립 카드에서 평평한 편집 안내 영역으로 바꾼다.
- 빈 덱은 큰 점선 카드 대신 첫 카드를 고르는 명확한 빈 상태로 표현한다.
- 덱 정보 모달은 프로필과 카드 상세 모달에서 정리한 작은 radius, 평평한 입력, 명확한 저장 액션을 따른다.

## Behavior

- 생성, 임시 저장, 발행, 그래프 편집, 카드 순서 변경 동작은 변경하지 않는다.
- 기존 생성 기본 제목과 서버 요청 형식은 이번 작업에서 변경하지 않는다.
- 데스크톱과 모바일은 현재의 사이드바/시트 구조를 그대로 사용한다.
- 편집 페이지도 공통 컴포넌트를 사용하므로 동일한 시각 언어를 적용받는다.

## Files

- `src/widgets/deck-editor/ui/deck-editor-nav.tsx`
- `src/widgets/deck-editor/deck-card-deck-mode.tsx`
- `src/widgets/deck-editor/deck-meta-panel.tsx`
- `src/widgets/deck-editor/deck-create-client.tsx`

## Verification

- 변경 파일 ESLint
- TypeScript typecheck
- production build
- 생성과 편집 화면에서 저장/발행 버튼 및 모바일 카드 추가 동작이 유지되는지 확인
