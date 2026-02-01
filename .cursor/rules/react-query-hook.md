---
description: 리액트 쿼리 (@tanstack/react-query) 를 작성할 때 쓰는 규칙입니다.
alwaysApply: true
---

# 폴더 경로

- service 폴더의 경로를 따라간다.

ex) service 폴더가 => book / card / me로 나뉘어 있으면
hooks폴더 밑에 => book/ card /me로 나누고  
book/react-query/
card/react-query/
me/react-query/

의 폴더 경로에 생성을 한다.

# Query 공통 규칙

- 각 폴더에 useQuery를 쓰는 경우 RQ[도메인내용]QueryKey.ts로 쿼리 키를 관리한다.
- get 으로 조회하는 api는 use[내용]Query.ts로 만든다.
- 쿼리키는 위에서 설정한 쿼리키에서 가져와 쓴다.
- 기본 staleTime은 5분 , gcTime은 10분으로 설정을 한다.

# Mutation 공통 규칙

- get 조회를 뺀 나머지 메서드에서 Mutation을 쓴다.
- post => use[내용]CreateMutation.ts , patch/put => use[내용]UpdateMutation.ts, delete => use[내용]DeleteMutation.ts 의 컨벤션으로 파일을 만든다.
- mutation은 키 관리를 따로 하지 않는다.
- mutationFn만 작성을 하고 타입은 추론으로 맡긴다.
