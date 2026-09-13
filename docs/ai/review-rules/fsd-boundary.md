# FSD Boundary Review Rules

## Review Goal

결정적 하네스가 보지 못하는 FSD 구조 판단을 확인한다. 주로 slice 배치, Public API 의도, `shared` 오염을 본다.

## Rules

- import 방향과 순환 의존은 실제 호출 관계를 추적해 확인한다. 현재 자동 아키텍처 검사 명령은 없다.
- 기존 slice 간 직접 import 자체를 오류로 보지 않고 책임이나 의존 관계가 깨지는 근거가 있을 때 지적한다.
- 외부에서 slice 내부 구현 파일을 깊게 import했다면 Public API 계약을 우회한 것인지 확인한다.
- slice 밖에 공개하기로 한 값만 Public API로 노출한다.
- `export *`를 습관처럼 쌓은 barrel file은 Public API가 아니다.
- 책·카드·덱 표현과 사용자 행위의 조합 위치가 기존 페이지나 widget의 책임과 맞는지 본다.
- `shared`에는 특정 화면 문구나 책·카드·덱의 비즈니스 정책을 숨기지 않는다.
- `src/app`은 Next.js 라우팅 디렉터리다. 기존 client 페이지와 entities/features/widgets 패턴을 우선하며 새 레이어를 강제하지 않는다.
- 필요한 레이어와 세그먼트만 만든다. 빈 폴더, 미사용 `index.ts`, 파일 종류만 반복하는 `utils` 창고는 만들지 않는다.
- 폴더를 옮긴다는 이유로 서버·URL·클라이언트 상태의 원본을 바꾸지 않는다.

## Findings To Prefer

- 명시적으로 정해진 Public API가 있는 slice에서 외부 코드가 그 계약을 우회한 경우
- Public API가 실제 외부 계약보다 넓어서 내부 구현을 과하게 노출하는 경우
- 재사용 도메인 코드가 Next route 파일에 의존해 라우팅 경계가 흐려진 경우
- `shared/lib`에 도메인 정책이나 특정 화면 전용 로직이 들어간 경우
- Public API 의도 없이 `index.ts`에서 내부 파일을 모두 재수출하는 경우
- FSD 이동과 함께 상태 원본이 바뀌거나 서버 응답 복사가 생긴 경우

## Do Not Flag

- 한 화면에서만 쓰는 로직을 feature로 올리지 않은 경우
- Public API를 만들지 않고 상대 경로로 같은 slice 내부 파일을 쓰는 경우
- Route Handler와 mock fixture를 `src/app/api`에 남겨 둔 경우
- 사용하지 않는 레이어를 만들지 않은 경우

## Review Output

문제를 지적할 때는 실제 의존 관계와 책임 위반을 설명한다. 수정안은 파일 이동보다 공개 계약과 조합 위치를 바로잡는 가장 작은 변경이어야 한다.
